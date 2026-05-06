import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, Share2, Palette, Settings2, Eye,
  ArrowLeft, ChevronLeft, ChevronRight, Sparkles,
  Maximize2, Minimize2,
} from "lucide-react";

import {
  fetchResume,
  createResume,  // Changed from createNewResume to createResume
  resetActiveResume,
  selectCurrentResume,
  selectResumeLoading,
  selectActiveResumeData,
  selectResumeError,
  setTemplate, 
  setColorScheme,
  updateResume,  // Add this for auto-save
  markSaved,     // Add this to mark when saved
  loadResumeForEdit,
} from "../../features/resume/resumeSlice.js";
import { exportToPDF, getResumeFilename } from "../../utils/pdfExport.js";
import { resumeService } from "../../services/resumeService.js";
import ResumeBuilder from "../../components/resume/ResumeBuilder.jsx";
import ResumePreview from "../../components/resume/ResumePreview.jsx";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";
import Modal from "../../components/common/Modal.jsx";
import Loader from "../../components/common/Loader.jsx";
import { TEMPLATES, COLOR_PRESETS } from "../../utils/constants.js";
import toast from "react-hot-toast";

const PREVIEW_SCALES = {
  sm: 0.4,
  md: 0.55,
  lg: 0.7,
};

const ResumeBuilderPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isNew = id === "new";
  const isLoading = useSelector(selectResumeLoading);
  const resumeData = useSelector(selectActiveResumeData);
  const error = useSelector(selectResumeError);
  const currentResume = useSelector(selectCurrentResume);

  const [showPreview, setShowPreview] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [previewScale, setPreviewScale] = useState("sm");
  const [fullPreview, setFullPreview] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load resume
  useEffect(() => {
    const loadResume = async () => {
      // Prevent multiple loads
      if (isInitialized) return;
      
      try {
        if (!isNew && id) {
          // We have a valid ID, fetch the resume
          console.log("Fetching resume with ID:", id);
          const result = await dispatch(fetchResume(id)).unwrap();
          
          if (result?.data?.resume) {
            console.log("Resume loaded successfully");
            // Load the resume data into the editor
            dispatch(loadResumeForEdit(result.data.resume));
          }
        } else if (isNew) {
          // Creating a new resume
          console.log("Creating new resume");
          const result = await dispatch(createResume({
            title: "Untitled Resume",
            template: "modern",
            colorScheme: {
              primary: "#6366f1",
              secondary: "#8b5cf6",
              accent: "#ec4899",
              background: "#ffffff",
              text: "#1f2937",
            },
            personalInfo: {
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              location: "",
              linkedin: "",
              github: "",
              website: "",
              portfolio: "",
              profileImage: "",
              jobTitle: "",
            },
            summary: "",
            experience: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
            languages: [],
            awards: [],
            volunteerWork: [],
            customSections: [],
            sectionOrder: [
              "summary",
              "experience",
              "education",
              "skills",
              "projects",
              "certifications",
              "languages",
              "awards",
            ],
            targetJobRole: "",
            targetJobDescription: "",
            tags: [],
            notes: "",
          })).unwrap();
          
          console.log("New resume created:", result);
          
          // Navigate to the new resume's edit page
          if (result?.data?.resume?._id) {
            navigate(`/resumes/${result.data.resume._id}`, { replace: true });
            return;
          }
        } else {
          console.error("No valid resume ID provided");
          toast.error("Invalid resume ID");
          navigate("/resumes");
          return;
        }
        
        setIsInitialized(true);
      } catch (err) {
        console.error("Error loading resume:", err);
        toast.error(err?.message || "Failed to load resume");
        navigate("/resumes");
      }
    };

    loadResume();

    // Cleanup function
    return () => {
      // Optional cleanup
    };
  }, [id, isNew, dispatch, navigate, isInitialized]);

  // Auto-save functionality
  useEffect(() => {
    if (!isInitialized || !resumeData || isNew) return;
    
    // Don't auto-save if there are no unsaved changes
    if (!resumeData.unsavedChanges && resumeData.lastSaved) return;
    
    const autoSaveTimeout = setTimeout(async () => {
      try {
        console.log("Auto-saving resume...");
        const result = await dispatch(updateResume({ 
          id: id, 
          data: resumeData 
        })).unwrap();
        
        if (result?.data?.resume) {
          dispatch(markSaved());
          toast.success("Auto-saved", { icon: "💾", duration: 2000 });
        }
      } catch (err) {
        console.error("Auto-save failed:", err);
        toast.error("Failed to auto-save");
      }
    }, 3000);
    
    return () => clearTimeout(autoSaveTimeout);
  }, [resumeData, id, isInitialized, isNew, dispatch]);

  const handleExportPDF = async () => {
    if (!resumeData) {
      toast.error("No resume data to export");
      return;
    }
    
    setIsExporting(true);
    try {
      const filename = getResumeFilename(resumeData);
      await exportToPDF("resume-preview", filename);
      if (!isNew && id) {
        await resumeService.trackDownload(id);
        toast.success("Download tracked successfully");
      }
      toast.success("PDF exported successfully!");
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  // Show loading state
  if ((isLoading && !isInitialized) || (isNew && !resumeData)) {
    return <Loader fullScreen message={isNew ? "Creating new resume..." : "Loading resume..."} />;
  }

  // Show error state
  if (error && !resumeData && !isNew) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-4">Error loading resume</div>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={() => navigate("/resumes")}>
            Back to Resumes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 z-30 flex-shrink-0">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/resumes")}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-slate-800 text-sm">
              {isNew ? "New Resume" : (resumeData?.title || "Edit Resume")}
            </h1>
            <p className="text-xs text-slate-400">
              {resumeData?.template ? `${resumeData.template} template` : "Choose a template"}
            </p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Template chooser */}
          <button
            onClick={() => { setShowTemplates(true); setShowColors(false); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 text-sm font-medium transition-colors"
          >
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline capitalize">{resumeData?.template || "Modern"}</span>
          </button>

          {/* Color chooser */}
          <button
            onClick={() => { setShowColors(true); setShowTemplates(false); }}
            className="p-2.5 rounded-xl border-2 border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* AI Button */}
          <button
            onClick={() => navigate(`/resumes/${id}/ai`)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-50 text-violet-700 border-2 border-violet-200 text-sm font-medium hover:bg-violet-100 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Tools</span>
          </button>

          {/* Preview toggle (mobile) */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="lg:hidden p-2.5 rounded-xl border-2 border-slate-200 text-slate-500 hover:border-slate-300 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Export PDF */}
          <Button
            variant="primary"
            size="sm"
            icon={Download}
            isLoading={isExporting}
            onClick={handleExportPDF}
          >
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div
          className={`
            flex-shrink-0 overflow-hidden transition-all duration-300
            ${showPreview ? "w-full lg:w-[45%] xl:w-[40%]" : "w-full"}
            ${showPreview ? "hidden lg:block" : "block"}
            border-r border-slate-100
          `}
          style={{ 
            display: (!showPreview || window.innerWidth >= 1024) ? "flex" : "none", 
            flexDirection: "column" 
          }}
        >
          <ResumeBuilder
            resumeId={id}
            onPreviewToggle={() => setShowPreview(!showPreview)}
            showPreview={showPreview}
          />
        </div>

        {/* Preview Panel */}
        <AnimatePresence>
          {showPreview && resumeData && (
            <motion.div
              key="preview-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 overflow-auto bg-slate-200/50 flex flex-col"
            >
              {/* Preview controls */}
              <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">Live Preview</span>
                  <Badge variant="success" size="xs">Real-time</Badge>
                </div>
                <div className="flex items-center gap-2">
                  {/* Scale controls */}
                  <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden">
                    {Object.keys(PREVIEW_SCALES).map((scale) => (
                      <button
                        key={scale}
                        onClick={() => setPreviewScale(scale)}
                        className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                          previewScale === scale
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {scale.toUpperCase()}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setFullPreview(!fullPreview)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    {fullPreview ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Preview area */}
              <div className="flex-1 overflow-auto p-6 flex justify-center">
                <div style={{ transform: `scale(${PREVIEW_SCALES[previewScale]})`, transformOrigin: "top center" }}>
                  <ResumePreview scale={1} id="resume-preview" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Template Modal */}
      <Modal isOpen={showTemplates} onClose={() => setShowTemplates(false)} title="Choose Template" size="2xl">
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {TEMPLATES.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  dispatch(setTemplate(template.id));
                  setShowTemplates(false);
                  toast.success(`${template.name} template applied`);
                }}
                className={`
                  cursor-pointer rounded-2xl overflow-hidden border-2 transition-all
                  ${resumeData?.template === template.id
                    ? "border-indigo-500 shadow-lg shadow-indigo-200/50"
                    : "border-slate-100 hover:border-indigo-200"
                  }
                `}
              >
                {/* Template preview */}
                <div
                  className="h-36 relative flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${template.colors[0]}, ${template.colors[1] || template.colors[0]})`,
                  }}
                >
                  <div className="text-white/20 text-4xl font-bold font-display">
                    {template.name.charAt(0)}
                  </div>
                  {resumeData?.template === template.id && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Badge variant="gradient">Selected ✓</Badge>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-sm text-slate-800">{template.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{template.description}</p>
                  <div className="flex gap-1 mt-2">
                    {template.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="default" size="xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Color Scheme Modal */}
      <Modal isOpen={showColors} onClose={() => setShowColors(false)} title="Color Scheme" size="md">
        <div className="p-6 space-y-5">
          {/* Presets */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Color Presets</h3>
            <div className="grid grid-cols-2 gap-3">
              {COLOR_PRESETS.map((preset) => (
                <motion.button
                  key={preset.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    dispatch(setColorScheme({
                      primary: preset.primary,
                      secondary: preset.secondary,
                      accent: preset.accent || preset.primary,
                    }));
                    toast.success(`${preset.name} theme applied`);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-100 hover:border-slate-200 transition-all text-left"
                >
                  <div className="flex gap-1 flex-shrink-0">
                    {[preset.primary, preset.secondary, preset.accent || preset.primary].map((color, i) => (
                      <div key={i} className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{preset.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom colors */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Custom Colors</h3>
            <div className="space-y-3">
              {[
                { key: "primary", label: "Primary Color" },
                { key: "secondary", label: "Secondary Color" },
                { key: "accent", label: "Accent Color" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={resumeData?.colorScheme?.[key] || "#6366f1"}
                    onChange={(e) => dispatch(setColorScheme({ [key]: e.target.value }))}
                    className="w-10 h-10 rounded-xl border-2 border-slate-200 cursor-pointer"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400 uppercase">{resumeData?.colorScheme?.[key] || "#6366f1"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ResumeBuilderPage;