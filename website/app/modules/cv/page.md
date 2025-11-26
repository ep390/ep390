---
title: Computer Vision
---

🚨 This is a work in progress 🚨

## Top choices:

- Face controlled Pacman 
  - https://eieio.games/blog/paccam/ 
- Media Pipe
  - https://ai.google.dev/edge/mediapipe/solutions/guide
  - Gesture Recognition
    - https://ai.google.dev/edge/mediapipe/solutions/vision/gesture_recognizer
    - Look at: Web - Code example - Guide
  - Object Detection
    - https://ai.google.dev/edge/mediapipe/solutions/vision/object_detector
    - Look at (Web - Code example - Guide)
- Weckinator
  - https://doc.gold.ac.uk/~mas01rf/Wekinator/videos/  

Playing Audio from the web
- If you are just playing audio samples you can get away with HTML5 
- Howler.js https://howlerjs.com/ 
- Tone.js https://tonejs.github.io/

## Secondary Resources

### Browser Based Computer Vision Resources

- OpenCV.js: https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html
- P5.js: https://p5js.org/ A JavaScript version of Processing
- MediaPipe: Google's framework for pose detection, hand tracking, face detection, and more. Works in browser and has great documentation: https://developers.google.com/mediapipe
- ml5.js: Friendly machine learning for the web, built on TensorFlow.js. Great for beginners: https://ml5js.org/
- TensorFlow.js: Run machine learning models directly in the browser: https://www.tensorflow.org/js
- Face-api.js: Face detection and recognition library for JavaScript: https://github.com/justadudewhohacks/face-api.js
- PoseNet/BodyPix: Real-time pose detection models from TensorFlow.js: https://www.tensorflow.org/lite/models/pose_estimation/overview
- Three.js: 3D graphics library often used with computer vision for visualizations: https://threejs.org/

### Object Tracking in Webcam Feed (Browser)

Best options for tracking objects in real-time webcam feeds:

- **MediaPipe Object Detection**: Google's solution with pre-trained models for detecting and tracking multiple objects. Excellent performance and documentation: https://developers.google.com/mediapipe/solutions/vision/object_detector
- **TensorFlow.js COCO-SSD**: Pre-trained model that can detect and track 80 different object classes (people, cars, phones, etc.) in real-time. Great tutorial: https://codelabs.developers.google.com/codelabs/tensorflowjs-object-detection
- **OpenCV.js Tracking**: Multiple tracking algorithms available (KCF, CSRT, MOSSE) for tracking specific objects after initial detection. Good for custom tracking needs: https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html
- **Human.js**: Comprehensive library for detecting and tracking human-related features (faces, hands, body poses) in real-time. Optimized for performance: https://jarrodanderson.github.io/human/
- **Handtrack.js**: Specifically designed for hand detection and tracking in webcam feeds. Easy to use API: https://github.com/victordibia/handtrack.js
- **WebAR.rocks.object**: Lightweight library for object detection, tracking, and 6DoF pose estimation. Good for AR-style applications: https://github.com/WebAR-rocks/WebAR.rocks.object


Non-Browser based options
- OpenCV: Stands for Open Computer Vision. A software package for analyzing objects from a digital video feed. Available in Python, C++, Java, and more: https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html
- Processing: Mostly an animation library in Java (Different from JavaScript): https://processing.org/
- OpenFrameworks: C++ toolkit for creative coding with extensive computer vision capabilities: https://openframeworks.cc/
- TouchDesigner: Node-based visual programming language for real-time interactive multimedia content: https://derivative.ca/
- Max/MSP: Visual programming language for music and multimedia, with computer vision extensions: https://cycling74.com/products/max
- Pure Data (Pd): Open-source alternative to Max/MSP: https://puredata.info/
- Python Libraries: PIL/Pillow (image processing), scikit-image (image analysis), MediaPipe (Python version), OpenCV-Python
- MediaPipe (Python/C++): Google's framework available for desktop applications: https://developers.google.com/mediapipe
- RunwayML: AI-powered creative tools for video and image generation: https://runwayml.com/
- Stable Diffusion: Open-source image generation model that can be run locally: https://stability.ai/


Fiducial markers are a special type of image designed for each object Computer Vision Tracking
- https://github.com/alitourani/awesome-fiducial-marker

### Hello World Examples

#### Java

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

#### C++

```cpp
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

#### C

```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

#### Python

```python
print('hello world')
```

#### JavaScript

```javascript
console.log('hello world')
```
