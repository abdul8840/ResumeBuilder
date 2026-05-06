import { useSelector } from "react-redux";
import { selectActiveResumeData, selectCurrentTemplate } from "../../features/resume/resumeSlice.js";
import ModernTemplate from "./templates/ModernTemplate.jsx";
import ClassicTemplate from "./templates/ClassicTemplate.jsx";
import MinimalTemplate from "./templates/MinimalTemplate.jsx";

const templateMap = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  creative: ModernTemplate,
  executive: ClassicTemplate,
  tech: MinimalTemplate,
  elegant: ClassicTemplate,
};

const ResumePreview = ({ scale = 1, id = "resume-preview" }) => {
  const resumeData = useSelector(selectActiveResumeData);
  const currentTemplate = useSelector(selectCurrentTemplate);

  const TemplateComponent = templateMap[currentTemplate] || ModernTemplate;

  return (
    <div
      id={id}
      className="bg-white shadow-strong rounded-lg overflow-hidden"
      style={{
        width: "210mm",
        minHeight: "297mm",
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        fontFamily: resumeData?.font?.family || "Inter",
      }}
    >
      <TemplateComponent data={resumeData} />
    </div>
  );
};

export default ResumePreview;