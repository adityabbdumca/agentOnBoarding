import { useProgress } from "@react-three/drei";

const LoaderAnimation = () => {
  const { progress } = useProgress();
  return (
    <div
      data-hidden={progress === 100}
      className="absolute top-0 left-0 w-full h-full flex items-center justify-center data-[hidden=true]:hidden"
    >
      <div className="p-6 transform transition duration-500 hover:scale-105">
        <div className="mb-5">
          <div className="bg-gray-200 h-1 w-28 rounded-full">
            <div
              className="bg-primary h-1 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>
        <h1 className="text-sm font-extrabold text-slate-500 mb-6 text-center">
          {progress.toFixed(0)}%
        </h1>
      </div>
    </div>
  );
};

export default LoaderAnimation;
