import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      size="lg"
      onClick={() => navigate(-1)}
      className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 w-fit my-4 pl-0"
    >
      <ArrowLeft size={14} />
      Back
    </Button>
  );
};

export default BackButton;
