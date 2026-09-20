<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { computed, onMounted, onUnmounted, ref, watch, type ComponentPublicInstance } from "vue";

type Quality = "auto" | "high" | "low";

type Props = {
  blur?: number;
  draggable?: boolean;
  refraction?: number;
  edgeIntensity?: number;
  rimHighlights?: number;
  quality?: Quality;
  resizeGranularity?: number;
};

const props = withDefaults(defineProps<Props>(), {
  blur: 2,
  draggable: false,
  refraction: 50,
  edgeIntensity: 0.8,
  rimHighlights: 0.5,
  quality: "auto",
  resizeGranularity: 8,
});

function detectLowPowerDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;

  const reducedMotion =
    typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reducedTransparency =
    typeof matchMedia !== "undefined" &&
    matchMedia("(prefers-reduced-transparency: reduce)").matches;

  return reducedMotion || reducedTransparency || cores <= 4 || memory <= 4;
}

let cachedLowPowerDetection: boolean | null = null;
function isLowPowerDevice(): boolean {
  if (cachedLowPowerDetection === null) {
    cachedLowPowerDetection = detectLowPowerDevice();
  }
  return cachedLowPowerDetection;
}

const isLowPower = computed(() => {
  if (props.quality === "high") return false;
  if (props.quality === "low") return true;
  return isLowPowerDevice();
});

function buildDisplacementMap(
  w: number,
  h: number,
  edgeIntensity: number,
): string {
  const edgeWidth = Math.max(Math.min(w, h) * 0.18, 1);
  const radius = Math.min(26, Math.max(Math.min(w, h) / 2 - 1, 0));
  const halfWidth = w / 2;
  const halfHeight = h / 2;
  const cornerX = Math.max(halfWidth - radius, 0);
  const cornerY = Math.max(halfHeight - radius, 0);

  // Lower cap on low-power devices: the map is cheap either way (it's tiny),
  // but a smaller canvas means less work per resize event and a smaller
  // data: URI for the browser to decode into the filter.
  const maxDim = isLowPower.value ? 28 : 48;
  const minShortAxis = isLowPower.value ? 10 : 16;
  const baseScale = Math.min(1, maxDim / Math.max(w, h));
  const cw = Math.max(w <= h ? minShortAxis : 1, Math.round(w * baseScale));
  const ch = Math.max(h <= w ? minShortAxis : 1, Math.round(h * baseScale));

  const invScaleX = w / cw;
  const invScaleY = h / ch;

  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  if (!ctx) return "";

  const imageData = ctx.createImageData(cw, ch);
  const data = imageData.data;

  const clamp = (value: number) => Math.max(0, Math.min(value, 1));
  const smoothstep = (value: number) => value * value * (3 - 2 * value);

  let idx = 0;
  for (let py = 0; py < ch; py++) {
    const sampleY = (py + 0.5) * invScaleY - halfHeight;

    for (let px = 0; px < cw; px++) {
      const sampleX = (px + 0.5) * invScaleX - halfWidth;
      const absX = Math.abs(sampleX);
      const absY = Math.abs(sampleY);
      let distance: number;
      let normalX = 0;
      let normalY = 0;

      if (absX > cornerX && absY > cornerY) {
        const cornerOffsetX = absX - cornerX;
        const cornerOffsetY = absY - cornerY;
        const cornerDistance = Math.hypot(cornerOffsetX, cornerOffsetY);
        distance = radius - cornerDistance;
        if (cornerDistance > 0) {
          normalX = (cornerOffsetX / cornerDistance) * Math.sign(sampleX);
          normalY = (cornerOffsetY / cornerDistance) * Math.sign(sampleY);
        }
      } else if (absX > cornerX) {
        distance = halfWidth - absX;
        normalX = Math.sign(sampleX);
      } else {
        distance = halfHeight - absY;
        normalY = Math.sign(sampleY);
      }

      if (normalX === 0 && normalY === 0) {
        if (halfWidth - absX < halfHeight - absY) {
          normalX = Math.sign(sampleX);
        } else {
          normalY = Math.sign(sampleY);
        }
      }

      const edgeProgress = clamp(1 - distance / edgeWidth);
      const edgeFactor = smoothstep(smoothstep(edgeProgress));
      const intensity = Math.max(edgeIntensity, 0);
      const displacementX = normalX * edgeFactor * intensity;
      const displacementY = normalY * edgeFactor * intensity;

      data[idx++] = Math.round(128 + displacementX * 127 * 0.92); // R -> x displacement
      data[idx++] = Math.round(128 + displacementY * 127 * 0.92); // G -> y displacement
      data[idx++] = 128; // B (unused)
      data[idx++] = 255; // A
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

function createFilterId() {
  let id = "";
  do {
    id = `lg-filter-${globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
  } while (typeof document !== "undefined" && document.getElementById(id));
  return id;
}

const filterId = createFilterId();
const glassEl = ref<HTMLElement | null>(null);
const lgMap = ref<SVGFEImageElement | null>(null);
const lgFilter = ref<SVGFilterElement | null>(null);

const supportsBackdropBlur =
  typeof CSS !== "undefined" &&
  (CSS.supports("backdrop-filter", "blur(1px)") ||
    CSS.supports("-webkit-backdrop-filter", "blur(1px)"));
const supportsSvgBackdropFilter =
  supportsBackdropBlur &&
  (CSS.supports("backdrop-filter", "url(#liquid-glass-filter)") ||
    CSS.supports("-webkit-backdrop-filter", "url(#liquid-glass-filter)"));

// The expensive part on old / integrated GPUs isn't building the tiny
// displacement-map canvas - it's the browser re-evaluating
// feDisplacementMap on backdrop-filter every composited frame. So the
// single biggest win for low-power hardware is skipping the SVG filter
// entirely and falling back to a plain CSS blur.
const useRefraction = computed(() => supportsSvgBackdropFilter && !isLowPower.value);

const backdropBlurValue = computed(() => {
  if (useRefraction.value) {
    return `blur(${props.blur}px) url(#${filterId})`;
  }
  return supportsBackdropBlur ? `blur(${props.blur}px)` : "none";
});

let resizeObserver: ResizeObserver | null = null;
let intersectionObserver: IntersectionObserver | null = null;
let rafId = 0;
let dragRafId = 0;

let isIntersecting = false;
let renderPending = false;

let lastObservedWidth = 0;
let lastObservedHeight = 0;

let lastRenderedWidth = 0;
let lastRenderedHeight = 0;
let lastMapKey = "";
let dragStartX = 0;
let dragStartY = 0;
let dragOffsetX = 0;
let dragOffsetY = 0;
let isDragging = false;
let pendingDragX = 0;
let pendingDragY = 0;

function setDragOffset() {
  glassEl.value?.style.setProperty("--glass-drag-x", `${dragOffsetX}px`);
  glassEl.value?.style.setProperty("--glass-drag-y", `${dragOffsetY}px`);
}

function scheduleDragOffset() {
  if (dragRafId) return;
  dragRafId = requestAnimationFrame(() => {
    dragRafId = 0;
    dragOffsetX = pendingDragX;
    dragOffsetY = pendingDragY;
    setDragOffset();
  });
}

function onPointerDown(event: PointerEvent) {
  if (!props.draggable || !glassEl.value) return;
  isDragging = true;
  dragStartX = event.clientX - dragOffsetX;
  dragStartY = event.clientY - dragOffsetY;
  glassEl.value.setPointerCapture(event.pointerId);
  event.preventDefault();
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging) return;
  pendingDragX = event.clientX - dragStartX;
  pendingDragY = event.clientY - dragStartY;
  scheduleDragOffset();
}

function stopDragging(event: PointerEvent) {
  if (!isDragging) return;
  isDragging = false;
  if (glassEl.value?.hasPointerCapture(event.pointerId)) {
    glassEl.value.releasePointerCapture(event.pointerId);
  }
  if (dragRafId) {
    cancelAnimationFrame(dragRafId);
    dragRafId = 0;
    dragOffsetX = pendingDragX;
    dragOffsetY = pendingDragY;
    setDragOffset();
  }
}

function updateFilter(width: number, height: number) {
  // Skip all canvas + SVG work when refraction is disabled - this is the
  // main CPU/GPU saving on low-power hardware.
  if (!useRefraction.value) {
    renderPending = false;
    lastRenderedWidth = width;
    lastRenderedHeight = height;
    return;
  }

  const w = Math.round(width);
  const h = Math.round(height);
  if (w <= 0 || h <= 0) return;

  lastRenderedWidth = w;
  lastRenderedHeight = h;
  renderPending = false;

  const map = lgMap.value;
  const filter = lgFilter.value;
  if (!map || !filter) return;

  const mapKey = `${w}:${h}:${props.edgeIntensity}`;
  if (mapKey !== lastMapKey) {
    const dataUri = buildDisplacementMap(w, h, props.edgeIntensity);
    if (!dataUri) return;
    map.setAttributeNS("http://www.w3.org/1999/xlink", "href", dataUri);
    map.setAttribute("href", dataUri);
    lastMapKey = mapKey;
  }

  const filterPadding = Math.max(Math.abs(props.refraction), 1);
  map.setAttribute("width", String(w));
  map.setAttribute("height", String(h));
  filter.setAttribute("x", String(-filterPadding));
  filter.setAttribute("y", String(-filterPadding));
  filter.setAttribute("width", String(w + filterPadding * 2));
  filter.setAttribute("height", String(h + filterPadding * 2));
}

function scheduleRender(width: number, height: number) {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => updateFilter(width, height));
}

function requestRender(width: number, height: number) {
  if (!isIntersecting) {
    renderPending = true;
    return;
  }
  scheduleRender(width, height);
}

function requestResizeRender(width: number, height: number) {
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => updateFilter(width, height));
}

function setGlassEl(el: Element | ComponentPublicInstance | null) {
  glassEl.value = el instanceof HTMLElement ? el : null;
}

function setLgMap(el: Element | ComponentPublicInstance | null) {
  lgMap.value = el instanceof SVGFEImageElement ? el : null;
}

function setLgFilter(el: Element | ComponentPublicInstance | null) {
  lgFilter.value = el instanceof SVGFilterElement ? el : null;
}

function getBorderBoxSize(entry: ResizeObserverEntry) {
  const borderBoxSize = entry.borderBoxSize;
  if (borderBoxSize) {
    const size = Array.isArray(borderBoxSize) ? borderBoxSize[0] : borderBoxSize;
    return { width: size.inlineSize, height: size.blockSize };
  }

  const element = entry.target as HTMLElement;
  const bounds = element.getBoundingClientRect();
  return { width: bounds.width, height: bounds.height };
}

// Round to the configured granularity so continuous resizes (window drags,
// animated layout, flexbox reflow) don't trigger a full canvas rebuild on
// every single pixel change - this is one of the more common jank sources
// on low-end machines.
function quantize(value: number, step: number) {
  if (step <= 1) return Math.round(value);
  return Math.round(value / step) * step;
}

onMounted(() => {
  if (!glassEl.value) return;

  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const size = getBorderBoxSize(entry);
      const step = isLowPower.value ? Math.max(props.resizeGranularity, 8) : props.resizeGranularity;
      const w = quantize(size.width, step);
      const h = quantize(size.height, step);

      if (w === lastObservedWidth && h === lastObservedHeight) continue;
      lastObservedWidth = w;
      lastObservedHeight = h;

      requestResizeRender(w, h);
    }
  });
  resizeObserver.observe(glassEl.value, { box: "border-box" });

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1];
      if (!entry) return;
      isIntersecting = entry.isIntersecting;

      if (
        isIntersecting &&
        (renderPending ||
          lastRenderedWidth !== lastObservedWidth ||
          lastRenderedHeight !== lastObservedHeight)
      ) {
        scheduleRender(lastObservedWidth, lastObservedHeight);
      }
    },
    { rootMargin: "200px" },
  );
  intersectionObserver.observe(glassEl.value);

  const initialBounds = glassEl.value.getBoundingClientRect();
  lastObservedWidth = Math.round(initialBounds.width);
  lastObservedHeight = Math.round(initialBounds.height);

  // First paint: build the map (or skip it) immediately rather than
  // waiting for a resize event.
  requestRender(lastObservedWidth, lastObservedHeight);
});

watch(
  () => [props.refraction, props.edgeIntensity, isLowPower.value],
  () => {
    // Force a fresh map build (or a switch to/from the blur-only fallback)
    // even if the observed size hasn't changed.
    lastMapKey = "";
    if (lastObservedWidth && lastObservedHeight) {
      requestRender(lastObservedWidth, lastObservedHeight);
    }
  },
);

onUnmounted(() => {
  resizeObserver?.disconnect();
  intersectionObserver?.disconnect();
  cancelAnimationFrame(rafId);
  cancelAnimationFrame(dragRafId);
});

const glass = { filterId, setGlassEl, setLgMap, setLgFilter };
</script>

<template>
  <div
    :ref="glass.setGlassEl"
    :class="[
      'glass-liquid select-none flex items-center justify-center',
      { 'glass-liquid--blur-fallback': !useRefraction },
    ]"
    v-bind="$attrs"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="stopDragging"
    @pointercancel="stopDragging"
    :style="{
      backdropFilter: backdropBlurValue,
      WebkitBackdropFilter: backdropBlurValue,
    }"
  >
    <slot />
  </div>

  <svg
    v-if="useRefraction"
    width="0"
    height="0"
    style="position: absolute"
    aria-hidden="true"
  >
    <filter
      :ref="glass.setLgFilter"
      :id="glass.filterId"
      x="0"
      y="0"
      width="0"
      height="0"
      filterUnits="userSpaceOnUse"
      primitiveUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feImage
        :ref="glass.setLgMap"
        x="0"
        y="0"
        width="0"
        height="0"
        preserveAspectRatio="none"
        result="displacementMap"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="displacementMap"
        :scale="props.refraction"
        xChannelSelector="R"
        yChannelSelector="G"
        result="refracted"
      />
    </filter>
  </svg>
</template>

<style scoped>
.glass-liquid {
  box-sizing: border-box;
  overflow: hidden;
  contain: layout style paint;
  isolation: isolate;
  translate: var(--glass-drag-x, 0px) var(--glass-drag-y, 0px);
  touch-action: v-bind("props.draggable ? 'none' : 'auto'");
  border: 1px solid rgba(255, 255, 255, 0.22);
  background-image: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.16),
    rgba(255, 255, 255, 0.04) 42%,
    rgba(0, 0, 0, 0.08)
  );
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.38),
    inset 0 -1px 0 rgba(0, 0, 0, 0.16),
    inset 0 0 18px color-mix(in srgb, white calc(v-bind("props.rimHighlights") * 70%), transparent),
    0 7px 24px rgba(0, 0, 0, 0.18);
}

.glass-liquid--blur-fallback {
  backdrop-filter: blur(v-bind("`${props.blur}px`"));
  -webkit-backdrop-filter: blur(v-bind("`${props.blur}px`"));
}

.glass-liquid {
  will-change: auto;
}
</style>