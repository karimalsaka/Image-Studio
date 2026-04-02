import ImageGenerator from "./components/ImageGenerator"

export default function Dashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-black mb-8">Generate an Image</h1>
            <ImageGenerator />
        </div>

    )
}