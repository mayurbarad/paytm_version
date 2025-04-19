import { useNavigate } from "react-router-dom";

export const TransferComplete = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-3xl font-bold text-center">
              Transfer Successfully!
            </h2>
            <div className="space-y-4">
              <button
                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                onClick={() => {
                  navigate("/dashboard");
                }}
              >
                Go back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
