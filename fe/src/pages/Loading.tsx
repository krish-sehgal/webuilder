import { Loader } from "../components/Loader"

function Loading() {
    return (
        <div role="status" className="flex justify-center items-center w-full h-screen bg-gray-900">
            <Loader />
        </div>
    )
}

export default Loading
