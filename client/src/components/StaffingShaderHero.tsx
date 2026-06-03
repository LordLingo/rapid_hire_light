/*
  §223 — WebGL2 shader background for the /lp/staffing hero.

  Adapted from a fragment shader by Matthias Hurrle (@atzedent). The original
  demo (provided by the site owner) tinted the field in orange/amber/red on a
  pure-black canvas. We:
    1. Ported it to a dependency-free TS component for this Vite stack
       (the source used Next.js `<style jsx>`, which does not exist here).
    2. Recolored the GLSL so the moving "light" field reads in the Rapid Hire
       brand blue/ink palette instead of orange — a deep cobalt-ink base with
       cool blue light streaks, matching --color-accent-ink / --color-footer.
    3. Gated all motion behind prefers-reduced-motion: when the user prefers
       reduced motion (or WebGL2 is unavailable) we render a static brand
       gradient instead of starting the animation loop.

  The canvas is purely decorative (aria-hidden); hero copy lives above it in
  StaffingLanding.tsx. Pointer interactivity from the original was dropped —
  the hero overlay must remain clickable, so the canvas is pointer-events:none.
*/

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Recolored fragment shader (brand blue/ink)                          */
/* ------------------------------------------------------------------ */
// Key recolor edits vs. the original orange demo:
//   - The per-iteration light color spin `cos(sin(i)*vec3(1,2,3))+1.` is
//     remapped onto a cool blue band via `cos(sin(i)*vec3(3,2,1)+vec3(3.4,3.0,1.2))`,
//     which biases the additive glow toward blue/cyan instead of warm hues.
//   - The cloud tint `vec3(bg*.25, bg*.137, bg*.05)` (warm brown) is replaced
//     with `vec3(bg*.04, bg*.10, bg*.26)` (deep cobalt-ink) so the base field
//     matches the footer ink-cobalt surface.
export const STAFFING_SHADER_SOURCE = `#version 300 es
/* base shader by Matthias Hurrle (@atzedent); recolored to Rapid Hire brand blue */
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
  float d=1., t=.0;
  for (float i=.0; i<3.; i++) {
    float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
    t=mix(t,d,a);
    d=a;
    p*=2./(i+1.);
  }
  return t;
}
void main(void) {
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.5,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for (float i=1.; i<12.; i++) {
    uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
    vec2 p=uv;
    float d=length(p);
    col+=.00125/d*(cos(sin(i)*vec3(3,2,1)+vec3(3.4,3.0,1.2))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.0022*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.04,bg*.10,bg*.26),d);
  }
  O=vec4(col,1);
}`;

const VERTEX_SRC = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ------------------------------------------------------------------ */
/* Canvas renderer                                                     */
/* ------------------------------------------------------------------ */

export function StaffingShaderCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion()) return; // static fallback handled by parent

    const gl = canvas.getContext("webgl2");
    if (!gl) return; // no WebGL2 → parent's static gradient shows through

    const dpr = Math.max(1, 0.5 * (window.devicePixelRatio || 1));

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERTEX_SRC);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, STAFFING_SHADER_SOURCE);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      // Compilation failed on this GPU/driver — bail to the static fallback.
      // eslint-disable-next-line no-console
      console.warn("StaffingShaderHero: shader compile failed", gl.getShaderInfoLog(fs));
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("StaffingShaderHero: program link failed", gl.getProgramInfoLog(program));
      return;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "resolution");
    const uTime = gl.getUniformLocation(program, "time");

    const resize = () => {
      // Size to the element's box (the hero), not the full window.
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const render = (now: number) => {
      resize();
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, now * 1e-3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: "block", width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Full-bleed hero background (canvas + static fallback + readability) */
/* ------------------------------------------------------------------ */
// Renders the deep ink-cobalt base gradient unconditionally (this is also the
// prefers-reduced-motion / no-WebGL2 fallback), with the animated canvas layered
// on top when motion is allowed, then a subtle vignette/darkening overlay so the
// light hero text stays readable over the brightest streaks.
export function StaffingShaderBackground() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(!prefersReducedMotion());
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[color:var(--color-footer)]" aria-hidden="true">
      {/* Static brand-gradient base / reduced-motion fallback */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 120% at 20% 0%, color-mix(in oklch, var(--color-accent-ink) 30%, var(--color-footer)) 0%, var(--color-footer) 55%, oklch(0.14 0.04 258) 100%)",
        }}
      />
      {/* Animated shader (skipped under reduced-motion) */}
      {animate && <StaffingShaderCanvas className="absolute inset-0" />}
      {/* Readability vignette: darken edges + bottom so text/CTAs keep contrast */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, oklch(0.16 0.04 258 / 0.72) 0%, oklch(0.16 0.04 258 / 0.32) 42%, oklch(0.16 0.04 258 / 0.0) 75%), linear-gradient(to top, oklch(0.13 0.035 258 / 0.65) 0%, transparent 45%)",
        }}
      />
    </div>
  );
}
