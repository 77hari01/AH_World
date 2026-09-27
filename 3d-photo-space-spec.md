# 3D Interactive Photo Space — React Website

## Project Goal

Build a beautiful, immersive **3D interactive photo website using React**.

The main concept is:

> The center of the screen contains one main letter/object. Around it, approximately 50 photos are placed inside a 3D space at different depths, sizes, positions, and rotations. The user can move the mouse to rotate and explore the entire photo space.

This should feel like entering a **3D gallery/photo universe**, not like viewing a normal photo grid.

---

## Core Experience

The website should open with a large central letter:

```text
                 PHOTO

        [image]          [image]

              [small image]

    [image]       H       [image]

          [image]      [image]

                 [image]
```

The letter `H` should remain the visual focal point.

Around the letter, approximately 50 images should float in 3D space.

The images should NOT appear in a regular grid.

They should feel like they are physically positioned around the viewer.

---

# Main Interaction

## Mouse Movement

The mouse controls the 3D camera/view.

### Move mouse left

The user should see the photo space rotate toward the left.

### Move mouse right

The user should see the photo space rotate toward the right.

### Move mouse up

The view should move/rotate upward.

### Move mouse down

The view should move/rotate downward.

The movement must be:

* smooth
* continuous
* natural
* slightly delayed/eased
* not jerky
* responsive

Do not require the user to click and drag for the primary interaction.

The user's mouse position should continuously influence the camera/object rotation.

---

# 360° Exploration

The user should be able to explore the photo space in all directions.

The experience should feel approximately like:

```text
                    UP

                     ↑

             [photos around]

LEFT  ←──────────  H  ──────────→  RIGHT

             [photos around]

                     ↓

                   DOWN
```

The user should be able to continuously rotate and discover different photos.

The photos should exist at different depths, so the experience has a strong sense of 3D space.

---

# Photo Arrangement

Support approximately **50 images**.

Images should automatically be distributed throughout the 3D environment.

Do NOT manually create a rigid grid.

Each image should have randomized or procedurally generated:

* X position
* Y position
* Z/depth position
* scale
* rotation
* slight tilt
* distance from center

However, randomness must still look aesthetically pleasing.

Avoid placing images directly on top of each other.

Maintain enough spacing so that the user can distinguish individual photos.

---

# Depth

Depth is extremely important.

Some photos should appear:

### Close

Large and detailed.

### Medium distance

Medium-sized.

### Far away

Smaller and slightly faded/blurred.

Example:

```text
              small
                📷

       📷                 📷

            medium 📷

                  H

       📷                 📷

             LARGE 📷
```

Use perspective to make the environment feel genuinely 3D.

---

# Central Letter

Place a large 3D-style letter in the center.

Default:

```text
H
```

The implementation should make it easy to change the letter later.

For example:

```javascript
const centralLetter = "H";
```

The letter should be visually distinctive but should not completely block the photos.

Possible visual treatment:

* elegant typography
* 3D depth
* subtle glow
* glass effect
* metallic appearance
* soft lighting
* shadow

Keep the central letter clean and premium.

---

# Photo Cards

Each image should look like a physical photo/card floating in 3D space.

Use:

* rounded corners
* subtle shadow
* thin border
* natural image cropping
* slightly different dimensions
* slight random rotation

Example:

```text
┌─────────────────┐
│                 │
│      PHOTO      │
│                 │
└─────────────────┘
```

Do not make every image identical.

Some can be:

* portrait
* landscape
* square
* slightly rotated
* closer
* farther away

But maintain a coherent overall visual design.

---

# Background

Create a beautiful immersive background.

Preferred direction:

## Dark cinematic 3D environment

Use:

* dark gradient
* subtle depth
* soft ambient lighting
* tiny floating particles
* very subtle noise/grain
* faint atmospheric glow
* depth-based fading

The background should not distract from the photos.

The photos should remain the primary visual elements.

Avoid an overly bright or colorful background.

---

# Camera Movement

Use a perspective camera.

The camera should have a natural perspective similar to a real 3D environment.

Mouse movement should control the camera smoothly.

Use interpolation/lerping rather than directly setting rotation.

Conceptually:

```javascript
targetRotationX = mouseY * sensitivity;
targetRotationY = mouseX * sensitivity;

currentRotationX +=
  (targetRotationX - currentRotationX) * easing;

currentRotationY +=
  (targetRotationY - currentRotationY) * easing;
```

This should create a smooth floating feeling.

---

# Interaction Details

The experience should feel premium.

Add subtle:

* parallax
* depth
* easing
* inertia
* hover effects
* lighting changes
* image scale changes

When the mouse gets close to an image, optionally:

* slightly enlarge it
* increase brightness
* bring it slightly forward
* show a subtle border/glow

Do not make the hover effect excessive.

---

# Photo Click

When the user clicks a photo:

Open a beautiful photo viewer/modal.

The selected photo should:

* enlarge smoothly
* appear centered
* show the full image
* have a dark backdrop
* have a close button

Allow the user to close the viewer and return to the 3D environment.

The transition should be smooth.

---

# Technology

Use:

* React
* JavaScript or TypeScript
* Three.js
* React Three Fiber
* Drei
* CSS / Tailwind CSS if useful

Recommended architecture:

```text
React
  │
  ├── React Three Fiber
  │       │
  │       ├── Scene
  │       ├── Camera
  │       ├── Photos
  │       ├── Central Letter
  │       ├── Lighting
  │       └── Particles
  │
  └── UI
          ├── Loading screen
          ├── Instructions
          └── Photo viewer
```

---

# Suggested Component Structure

Create components similar to:

```text
src/
├── components/
│   ├── PhotoSpace.jsx
│   ├── Photo.jsx
│   ├── CentralLetter.jsx
│   ├── Background.jsx
│   ├── Particles.jsx
│   ├── PhotoViewer.jsx
│   └── LoadingScreen.jsx
│
├── data/
│   └── photos.js
│
├── App.jsx
├── main.jsx
└── styles/
    └── global.css
```

Keep the code modular.

---

# Image Data

Make the image collection easy to replace.

Example:

```javascript
const photos = [
  "/images/photo01.jpg",
  "/images/photo02.jpg",
  "/images/photo03.jpg",
  "/images/photo04.jpg",
  "/images/photo05.jpg",
  // ...
];
```

The application should automatically work with approximately 50 images.

Do not hardcode the position of every photo.

Generate positions programmatically.

---

# Procedural 3D Distribution

Create a function that generates visually pleasing positions.

For example:

```javascript
function generatePhotoPosition(index, total) {
  // Generate X
  // Generate Y
  // Generate Z
  // Generate scale
  // Generate rotation

  return {
    position: [x, y, z],
    rotation: [rx, ry, rz],
    scale
  };
}
```

The distribution should create a surrounding 3D composition.

Avoid a perfect sphere if it makes the photos difficult to see.

Prefer an **organic gallery-like distribution**.

---

# Performance

The website must remain smooth with approximately 50 images.

Optimize for browser performance.

Requirements:

* lazy-load images when appropriate
* use compressed images
* avoid unnecessarily huge textures
* avoid excessive shadows
* avoid expensive post-processing
* keep animation calculations efficient
* use GPU-friendly rendering
* avoid unnecessary React re-renders

Target a smooth experience on normal modern laptops.

---

# Mobile Support

The website should also work on mobile.

On mobile:

* use touch movement
* support swipe/drag to explore
* optionally support device orientation
* keep photos readable
* maintain the 3D effect
* avoid excessive GPU usage

Desktop:

```text
Mouse → 3D exploration
```

Mobile:

```text
Touch drag → 3D exploration
```

---

# UI

Keep the UI minimal.

Initial screen could show:

```text
                         H


              Move your cursor
                to explore


       [floating photos everywhere]
```

After a few seconds, the instruction can fade away.

Do not clutter the screen with menus.

The main focus should always be the 3D photo environment.

---

# Visual Style

Use a premium cinematic aesthetic.

Keywords:

* immersive
* elegant
* minimal
* cinematic
* futuristic
* emotional
* sophisticated
* spatial
* photographic

Avoid:

* generic dashboard design
* card-grid layouts
* excessive buttons
* bright gradients everywhere
* unnecessary text
* conventional website sections

The page should feel more like an **interactive digital art installation** than a normal website.

---

# Important Visual Requirement

The most important requirement is:

> When the user moves the mouse, it must feel like they are looking around inside a 3D space containing many floating photographs.

It should NOT feel like:

```text
❌ scrolling a website
❌ moving a flat image carousel
❌ rotating one 2D image
❌ viewing a normal photo grid
```

It SHOULD feel like:

```text
        3D SPACE

   📷          📷

       📷

            H

 📷               📷

       📷     📷

   📷          📷
```

The entire environment should respond naturally to the user's movement.

---

# Optional Advanced Effects

If performance allows, add:

### 1. Depth of Field

Far photos can become slightly blurred.

### 2. Floating Animation

Photos can slowly move by a very small amount.

### 3. Inertia

When the mouse stops, the environment should continue moving slightly before settling.

### 4. Dynamic Lighting

A soft light source can move subtly with the camera.

### 5. Hover Focus

Hovered photos can become slightly larger and sharper.

### 6. Smooth Photo Transition

When opening a photo, animate it from its 3D position into the center of the screen.

---

# Loading Experience

Because approximately 50 images may need to load, create a simple loading experience.

Example:

```text
                 H

          Loading memories...

               37%
```

Once the required assets are ready, transition smoothly into the 3D environment.

Do not leave the user looking at a blank screen.

---

# Final Experience

The finished website should feel like this:

```text
                    📷

        📷                     📷

                 small 📷


     📷             H              📷


             📷            📷

   📷                              📷


                    📷
```

Move the mouse:

```text
             ←────────────→

         The entire 3D space
              rotates
```

The user can continuously explore the environment and discover all approximately 50 photos from different directions.

The result should feel **beautiful, immersive, smooth, and premium**, with the central letter acting as the visual anchor.

---

# Development Priority

Build in this order:

1. React project setup
2. Three.js / React Three Fiber scene
3. Perspective camera
4. Central 3D letter
5. Add one photo
6. Add multiple photos
7. Procedural 3D photo distribution
8. Mouse-controlled camera rotation
9. Smooth interpolation/inertia
10. Beautiful background
11. Photo hover interaction
12. Photo click viewer
13. Loading experience
14. Mobile touch interaction
15. Performance optimization
16. Final visual polish

Do not over-engineer the first version.

First make the **core 3D mouse-controlled photo environment** work correctly, then add visual effects.

---

# Success Criteria

The project is successful when:

* 50 photos can be loaded easily.
* Photos are distributed organically in 3D space.
* The central letter remains the visual anchor.
* Moving the mouse rotates/explores the 3D environment.
* The user can explore different directions.
* Photos have different sizes and depths.
* The environment feels genuinely 3D.
* Movement is smooth and natural.
* The background looks cinematic.
* Clicking a photo opens it beautifully.
* The experience works on desktop and mobile.
* The website remains performant in a normal browser.

**Primary goal: create the feeling of entering a 3D space filled with floating memories/photos and exploring that space with the mouse.**
