import Image from "next/image";

const images = [
  { cfg: 2, src: "/students/Wanlin/picture/2.png" },      // cfg 2 → 2.png
  { cfg: 5, src: "/students/Wanlin/picture/5.1.png" },    // cfg 5 → 5.1.png
  { cfg: 6, src: "/students/Wanlin/picture/6.png" },      // cfg 6 → 6.png
  { cfg: 8, src: "/students/Wanlin/picture/8.png" },      // cfg 8 → 8.png
  { cfg: 10, src: "/students/Wanlin/picture/10.png" },    // cfg 10 → 10.png
  { cfg: 15, src: "/students/Wanlin/picture/15.png" },    // cfg 15 → 15.png
  { cfg: 17, src: "/students/Wanlin/picture/17.png" },    // cfg 17 → 17.png
  { cfg: 20, src: "/students/Wanlin/picture/20.png" },    // cfg 20 → 20.png
];

export default function Hw8Page() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">
          HW8 – Classifier Free Guidance (CFG) Experiment
        </h1>
        <p className="text-sm text-gray-600">
          All images were generated with the same seed and parameters in ComfyUI,
          varying only the CFG value.
        </p>
      </header>

      {/* 1. Experiment setup / parameters */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Experiment Setup</h2>
        <p>
          This experiment explores how <strong>Classifier Free Guidance (CFG)</strong>
          affects image generation in a diffusion model. I used ComfyUI to generate
          8 images with identical parameters, changing only the CFG value.
        </p>

        <div className="border rounded-lg p-4 text-sm space-y-1 bg-gray-50">
          <p><strong>Prompt:</strong> A Bernese Mountain Dog sitting on a grassy hill during golden hour, highly detailed fur, soft warm sunlight, realistic photography, 85mm lens, natural environment</p>
          <p><strong>Negative Prompt:</strong> text, watermark, blurry, distorted face, extra legs, low quality</p>
          <p><strong>Model:</strong> v1-5-pruned-emaonly-fp16.safetensors (Stable Diffusion 1.5)</p>
          <p><strong>Sampler:</strong> euler</p>
          <p><strong>Scheduler:</strong> normal</p>
          <p><strong>Steps:</strong> 20</p>
          <p><strong>Seed:</strong> 402698511131768 (same seed for all images)</p>
          <p><strong>Resolution:</strong> 512 × 512</p>
          <p><strong>CFG values:</strong> 2, 5, 6, 8, 10, 15, 17, 20</p>
        </div>
      </section>

      {/* 2. Image gallery */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Generated Images</h2>
        <p>
          Each image below was generated with the parameters above, changing
          only the CFG value. Notice how style, sharpness, and prompt adherence
          change as CFG increases.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((img) => (
            <figure
              key={img.cfg}
              className="border rounded-lg p-3 bg-white shadow-sm flex flex-col items-center"
            >
              <div className="w-full aspect-square relative">
                <Image
                  src={img.src}
                  alt={`Image generated with CFG = ${img.cfg}`}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <figcaption className="mt-2 text-sm font-medium">
                CFG = {img.cfg}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* 3. Analysis */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Analysis & Observations</h2>

        <p>
          Overall, increasing CFG pushes the model to follow the text prompt
          more strongly, but this also changes the{" "}
          <em>creativity, noise level, and stability</em> of the images.
        </p>

        <h3 className="text-xl font-semibold">Low CFG (2–6)</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            At very low CFG (e.g. CFG = 2), the image feels more relaxed and
            sometimes less faithful to the prompt. Backgrounds or extra details
            may appear that I didn't explicitly ask for.
          </li>
          <li>
            As CFG increases to around 5–6, the image becomes more aligned with
            the prompt while still keeping some variation and softness.
          </li>
        </ul>

        <h3 className="text-xl font-semibold">Medium CFG (around 8–15)</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            In this range, the images usually look the most balanced for this
            prompt: they are sharper, more detailed, and follow the prompt
            more closely without completely collapsing into a single rigid look.
          </li>
          <li>
            I noticed that features I described in the prompt become clearer,
            and unwanted random elements start to disappear.
          </li>
        </ul>

        <h3 className="text-xl font-semibold">High CFG (17–20)</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>
            At high CFG values, the model tries very hard to match the prompt.
            This can make the image appear extremely sharp or stylized, but
            sometimes it looks overcooked or unnatural.
          </li>
          <li>
            In my images, I observed that textures and contrast became stronger,
            but some areas started to show artifacts / weird details that didn&apos;t
            appear at lower CFG values.
          </li>
        </ul>

        <h3 className="text-xl font-semibold">Summary</h3>
        <p className="text-sm">
          In this assignment, I used fixed noise and identical settings to isolate the effect of CFG on image generation. This made the behavior of the diffusion model much easier to understand.
        </p>

        <h3 className="text-xl font-semibold">What I Learned About CFG</h3>
        <p className="text-sm">
          Doing this experiment honestly taught me more than any explanation online. Since I used the same seed every time, it felt like watching the same picture slowly change personalities as I moved the CFG up and down.
        </p>

        <p className="text-sm">
          When the CFG was low (like 2 or 5.1), the model was basically chilling. The images looked soft and kind of dreamy, but they didn&apos;t really follow the prompt that much. It was like the model had its own ideas.
        </p>

        <p className="text-sm">
          Around the middle range (6–10), everything looked the best. The images were clear, actually matched what I asked for, but still had some creativity. This felt like the &quot;sweet spot.&quot;
        </p>

        <p className="text-sm">
          When I pushed CFG even higher (15, 17, 20), the model became very intense. It tried super hard to follow the prompt, sometimes a little too hard. Details started looking stiff or over-edited.
        </p>

        <p className="text-sm">
          And then I tried 30 and 40… and honestly the images got kind of weird. Like, the model was over-focusing so much that the whole picture started to fall apart. It felt like giving someone instructions and they&apos;re trying so hard to be perfect that it becomes creepy instead.
        </p>

        <p className="text-sm">
          Overall, doing this hands-on made CFG actually make sense to me. It&apos;s basically a &quot;how strict do you want the model to be&quot; slider. And now I know that somewhere in the middle is where the magic usually happens.
        </p>
      </section>

      {/* 4. Optional: brief notes on other parameters */}
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Why the Other Parameters Matter </h2>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>
            <strong>Seed:</strong> keeps the underlying noise pattern fixed so
            I can isolate the effect of CFG.
          </li>
          <li>
            <strong>Steps:</strong> controls how many refinement steps the
            diffusion process takes. More steps usually give cleaner images but
            take more time.
          </li>
          <li>
            <strong>Sampler:</strong> changes the algorithm for updating the
            image at each step; different samplers can give slightly different
            styles or stability.
          </li>
          <li>
            <strong>Model / checkpoint:</strong> defines the visual style and
            capabilities of the generator (e.g. SDXL vs. other models).
          </li>
        </ul>
      </section>
    </main>
  );
}

