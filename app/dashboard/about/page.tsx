import FadeIn from "@/app/components/FadeIn";

const features = [
  {
    icon: (
      <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Lightning Fast",
    description: "Generate high-quality images in seconds with state-of-the-art AI models.",
  },
  {
    icon: (
      <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
      </svg>
    ),
    title: "Any Style",
    description: "From photorealistic to abstract art — describe it and watch it come to life.",
  },
  {
    icon: (
      <svg className="w-4 h-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Private & Secure",
    description: "Your prompts and generated images are processed securely and never shared.",
  },
];

export default function About() {
  return (
    <div>
      <FadeIn>
        <h1 className="font-display text-3xl font-medium tracking-tight text-gray-900 mb-1">
          About
        </h1>
        <p className="text-gray-400 text-sm mb-10 max-w-lg">
          Image Studio lets you generate images using AI. Type a prompt, and let the model do the rest.
        </p>
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-3">
        {features.map(({ icon, title, description }, i) => (
          <FadeIn key={title} delay={0.1 + i * 0.08}>
            <div className="rounded-2xl border border-stone-200 p-5 bg-stone-50 hover:bg-stone-100 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center mb-3">
                {icon}
              </div>
              <h3 className="font-semibold text-sm text-gray-900 mb-1.5">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
