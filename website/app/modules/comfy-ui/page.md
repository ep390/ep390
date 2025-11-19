---
title: ComfyUI
---

Start [downloading this model (2.1GB)](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors) before going further.

To explore image generation, we will be using ComfyUI. 

- Commercial services like ChatGPT or Midjourney are the easiest way to generate dramatic images
- The value of these images tends to be low because they are trivial to create
- We're going to use the ComfyUI graphical programming tool
- Think of ComfyUI as **Max for AI Image Gen**

ComfyUI has advantages and disadvantages:

- **Pro:** ComfyUI does a good job of exposing model internals and building understanding
- **Pro:** ComfyUI gives A LOT more control over the generation process
- **Con:** ComfyUI [can be hard to install](https://docs.comfy.org/installation/manual_install)
- **Con:** ComfyUI is designed to run on a computer with a large GPU

Our goal is to build understanding, not dramatic images, so these tradeoffs are acceptable.

## ComfyUI Installation

There are a lot of different ways to install ComfyUI. We will use the "manual" install method, because I have found it to work best on Mac as of Fall 2025.


### 1. Create the conda environment

First, install Miniconda if needed
- Type `which conda` in the terminal.
- If the output is empty or you see `conda not found`, you need to install Miniconda. Follow the [install instructions](https://www.anaconda.com/docs/getting-started/miniconda/install#macos-2).


Once you have Miniconda installed:

```bash
# Create a conda python environment
conda create -n comfyenv
conda activate comfyenv
conda install pytorch-nightly::pytorch torchvision torchaudio -c pytorch-nightly
```

### 2. Install ComfyUI

```bash
# Clone from git
git clone https://github.com/comfyanonymous/ComfyUI.git
cd ComfyUI
pip install -r requirements.txt
```

A lot of ComfyUI tutorials you may find on the web use "custom nodes" and
"custom models." Installing the ComfyUI manager can make installing addons
easier. It is not necessary for class.

```bash
# Optional: Install the manager
git clone https://github.com/ltdrdata/ComfyUI-Manager custom_nodes/comfyui-manager
```

### 3. Download this Stable Diffusion model

Next, download the [Comfy-Org/stable-diffusion-v1-5-archive](https://huggingface.co/Comfy-Org/stable-diffusion-v1-5-archive/blob/main/v1-5-pruned-emaonly-fp16.safetensors) model. Find the "download" button and put the resulting `.safetensors` file in the ComfyUI `models/checkpoints/` directory.

### 4. Run ComfyUI

```bash
# If necessary, re-activate the conda env we created in step 1.
conda activate comfyenv
# Run
python main.py --force-fp32 --fp32-vae
```

Now you can go to http://127.0.0.1:8188 in your browser.


# Resources

- [But how do AI images and videos actually work? (YouTube)](https://www.youtube.com/watch?v=iv-5mZ_9CPY)
- [ComfyUI: Advanced Understanding (YouTube)](https://www.youtube.com/watch?v=_C7kR2TFIX0&list=PLcW1kbTO1uPhDecZWV_4TGNpys4ULv51D&index=1)
- [The Oatmeal: A cartoonist's review of AI art](https://theoatmeal.com/comics/ai_art)

Two other ways to do image generation on a Mac

- [DrawThings](https://drawthings.ai/): A simple MacOS app for on-device generation
- [ComfyUI Cloud](https://www.comfy.org/cloud): Use a powerful cloud computer running ComfyUI **($20/month)** 
