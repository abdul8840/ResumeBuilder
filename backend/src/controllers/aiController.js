import { GoogleGenerativeAI } from "@google/generative-ai";
import Resume from "../models/Resume.js";
import Analytics from "../models/Analytics.js";
import { extractTextFromResume } from "../utils/helpers.js";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const callGemini = async (prompt) => {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

// @desc    Generate professional summary
// @route   POST /api/ai/generate-summary
// @access  Private
export const generateSummary = async (req, res, next) => {
  try {
    const { resumeId, jobTitle, experience, skills, tone = "professional" } = req.body;

    const prompt = `You are an expert resume writer. Generate a compelling, ATS-optimized professional summary for a resume.

Job Title: ${jobTitle || "Professional"}
Years of Experience: ${experience || "Not specified"}
Key Skills: ${Array.isArray(skills) ? skills.join(", ") : skills || "Not specified"}
Tone: ${tone}

Requirements:
- Write 3-4 impactful sentences
- Start with a strong action word or professional title
- Include quantifiable achievements if possible
- Make it ATS-friendly with relevant keywords
- Keep it under 100 words
- Make it compelling and unique
- Use first person but without "I"

Return ONLY the summary text, no explanation or formatting.`;

    const summary = await callGemini(prompt);

    if (resumeId) {
      await Resume.findOneAndUpdate(
        { _id: resumeId, user: req.user._id },
        {
          summary: summary.trim(),
          aiSummaryGenerated: true,
          lastAIInteraction: new Date(),
          $inc: { aiEnhancements: 1 },
        }
      );

      await Analytics.create({
        user: req.user._id,
        resume: resumeId,
        eventType: "ai_summary",
        metadata: { jobRole: jobTitle },
      });
    }

    res.status(200).json({
      success: true,
      message: "Professional summary generated! ✨",
      data: { summary: summary.trim() },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enhance experience description
// @route   POST /api/ai/enhance-experience
// @access  Private
export const enhanceExperience = async (req, res, next) => {
  try {
    const { description, position, company, achievements = [] } = req.body;

    const prompt = `You are an expert resume writer specializing in transforming work experience into powerful, ATS-optimized bullet points.

Position: ${position}
Company: ${company}
Current Description: ${description}
${achievements.length ? `Current Achievements: ${achievements.join("\n")}` : ""}

Transform this into 4-6 powerful bullet points that:
- Start with strong action verbs (Led, Developed, Implemented, Increased, etc.)
- Include specific metrics and numbers where inferred or appropriate
- Follow the STAR method (Situation, Task, Action, Result)
- Are ATS-optimized with industry keywords
- Quantify impact wherever possible
- Are concise but impactful (1-2 lines each)

Return ONLY a JSON object with this structure:
{
  "description": "Enhanced paragraph description",
  "achievements": ["bullet point 1", "bullet point 2", "bullet point 3", "bullet point 4"]
}`;

    const rawResponse = await callGemini(prompt);

    // Parse JSON response
    let enhanced;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      enhanced = jsonMatch ? JSON.parse(jsonMatch[0]) : { description: rawResponse, achievements: [] };
    } catch {
      enhanced = { description: rawResponse.trim(), achievements: [] };
    }

    res.status(200).json({
      success: true,
      message: "Experience enhanced with AI! 🚀",
      data: { enhanced },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Suggest skills based on job role
// @route   POST /api/ai/suggest-skills
// @access  Private
export const suggestSkills = async (req, res, next) => {
  try {
    const { jobRole, currentSkills = [], experienceLevel = "mid-level" } = req.body;

    const prompt = `You are a career advisor and skills expert. Suggest relevant skills for a resume.

Job Role: ${jobRole}
Experience Level: ${experienceLevel}
Current Skills: ${currentSkills.join(", ")}

Provide a comprehensive list of skills categorized by type. Include:
- Technical Skills (hard skills specific to the role)
- Soft Skills (interpersonal and transferable skills)
- Tools & Technologies
- Industry-Specific Skills

Return ONLY a JSON object with this structure:
{
  "technical": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "soft": ["skill1", "skill2", "skill3"],
  "tools": ["tool1", "tool2", "tool3", "tool4"],
  "industry": ["skill1", "skill2", "skill3"],
  "trending": ["emerging skill1", "emerging skill2"]
}

Suggest 5-8 skills per category. Don't include already listed current skills.`;

    const rawResponse = await callGemini(prompt);

    let skills;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      skills = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      skills = { technical: [], soft: [], tools: [], industry: [], trending: [] };
    }

    res.status(200).json({
      success: true,
      message: "Skills suggested based on your role! 💡",
      data: { skills },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate ATS score and get improvements
// @route   POST /api/ai/ats-score
// @access  Private
export const calculateATSScore = async (req, res, next) => {
  try {
    const { resumeId, jobDescription } = req.body;

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const resumeText = extractTextFromResume(resume);

    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze this resume for ATS compatibility.

RESUME CONTENT:
${resumeText}

${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}` : ""}

Analyze and provide detailed scoring. Return ONLY a valid JSON object with this exact structure:
{
  "overall": 75,
  "sections": {
    "keywords": 70,
    "formatting": 85,
    "readability": 80,
    "completeness": 75,
    "experience": 70
  },
  "improvements": [
    "Add more quantifiable achievements with specific metrics",
    "Include relevant keywords from the job description",
    "Strengthen your professional summary"
  ],
  "keywords": {
    "found": ["project management", "leadership", "agile"],
    "missing": ["stakeholder management", "budget planning", "risk assessment"],
    "density": 3.5
  },
  "detailedFeedback": {
    "strengths": ["Clear structure", "Good use of action verbs"],
    "weaknesses": ["Missing metrics", "Keywords need optimization"]
  }
}

All scores must be integers between 0-100. Provide 5-8 specific, actionable improvements.`;

    const rawResponse = await callGemini(prompt);

    let atsData;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      atsData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      atsData = null;
    }

    if (!atsData) {
      return res.status(500).json({
        success: false,
        message: "Failed to parse ATS analysis. Please try again.",
      });
    }

    // Update resume ATS score
    const prevScore = resume.atsScore?.overall || 0;
    await Resume.findByIdAndUpdate(resumeId, {
      atsScore: {
        ...atsData,
        lastChecked: new Date(),
        jobDescription: jobDescription || "",
      },
      lastAIInteraction: new Date(),
    });

    await Analytics.create({
      user: req.user._id,
      resume: resumeId,
      eventType: "ats_check",
      metadata: {
        atsScoreBefore: prevScore,
        atsScoreAfter: atsData.overall,
      },
    });

    res.status(200).json({
      success: true,
      message: "ATS analysis complete! 📊",
      data: { atsScore: atsData },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Customize resume for job description
// @route   POST /api/ai/customize-for-job
// @access  Private
export const customizeForJob = async (req, res, next) => {
  try {
    const { resumeId, jobDescription, jobTitle, companyName } = req.body;

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const resumeText = extractTextFromResume(resume);

    const prompt = `You are an expert resume consultant. Analyze the resume and job description to provide specific customization suggestions.

CURRENT RESUME:
${resumeText}

JOB TITLE: ${jobTitle}
COMPANY: ${companyName || "Not specified"}
JOB DESCRIPTION:
${jobDescription}

Provide specific, actionable customization recommendations. Return ONLY a valid JSON:
{
  "summaryRewrite": "Rewritten summary tailored to this specific job...",
  "keywordsToAdd": ["keyword1", "keyword2", "keyword3"],
  "skillsToHighlight": ["skill1", "skill2", "skill3"],
  "experienceAdjustments": [
    {
      "index": 0,
      "suggestion": "Rewrite this experience to emphasize..."
    }
  ],
  "missingElements": ["What's missing from resume", "Another gap"],
  "customizationScore": 72,
  "overallMatch": "This resume is a 72% match for this position. Key areas to improve...",
  "priorityActions": ["Most important action", "Second priority", "Third priority"]
}`;

    const rawResponse = await callGemini(prompt);

    let customization;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      customization = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      customization = { overallMatch: rawResponse };
    }

    // Update resume with target job info
    await Resume.findByIdAndUpdate(resumeId, {
      targetJobRole: jobTitle,
      targetJobDescription: jobDescription,
      lastAIInteraction: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Resume customization analysis complete! 🎯",
      data: { customization },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Optimize keywords in resume
// @route   POST /api/ai/optimize-keywords
// @access  Private
export const optimizeKeywords = async (req, res, next) => {
  try {
    const { resumeId, jobDescription, industry } = req.body;

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const resumeText = extractTextFromResume(resume);

    const prompt = `You are an SEO and ATS keyword optimization expert for resumes.

RESUME: ${resumeText}
INDUSTRY: ${industry || "General"}
${jobDescription ? `JOB DESCRIPTION: ${jobDescription}` : ""}

Analyze and provide keyword optimization. Return ONLY valid JSON:
{
  "currentKeywords": ["existing strong keyword1", "existing keyword2"],
  "suggestedKeywords": [
    {"keyword": "project management", "priority": "high", "context": "Add to summary and experience"},
    {"keyword": "agile methodology", "priority": "medium", "context": "Add to skills section"}
  ],
  "keywordDensity": 2.8,
  "optimizedPhrases": [
    "Instead of 'managed team', use 'led cross-functional team of 10 engineers'",
    "Replace 'worked on projects' with 'delivered 5 high-impact projects'"
  ],
  "industryKeywords": ["term1", "term2", "term3"],
  "actionVerbs": ["Led", "Implemented", "Developed", "Optimized", "Delivered"]
}`;

    const rawResponse = await callGemini(prompt);

    let optimization;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      optimization = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      optimization = {};
    }

    res.status(200).json({
      success: true,
      message: "Keyword optimization analysis complete! 🔑",
      data: { optimization },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate project description
// @route   POST /api/ai/generate-project
// @access  Private
export const generateProjectDescription = async (req, res, next) => {
  try {
    const { projectName, technologies, role, duration } = req.body;

    const prompt = `Generate a compelling project description for a resume.

Project Name: ${projectName}
Technologies Used: ${Array.isArray(technologies) ? technologies.join(", ") : technologies}
Your Role: ${role || "Developer"}
Duration: ${duration || "Not specified"}

Create:
1. A 2-3 sentence project description
2. 3-4 bullet points highlighting key achievements and technical aspects

Return ONLY valid JSON:
{
  "description": "Built a [type of application] using [technologies] that [main purpose/impact]...",
  "highlights": [
    "Implemented [feature] resulting in [specific benefit]",
    "Developed [component] using [technology] achieving [result]",
    "Optimized [aspect] reducing [metric] by X%"
  ]
}`;

    const rawResponse = await callGemini(prompt);

    let projectData;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      projectData = jsonMatch ? JSON.parse(jsonMatch[0]) : { description: rawResponse };
    } catch {
      projectData = { description: rawResponse };
    }

    res.status(200).json({
      success: true,
      message: "Project description generated! 🛠️",
      data: { project: projectData },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get resume improvement tips
// @route   POST /api/ai/improvement-tips
// @access  Private
export const getImprovementTips = async (req, res, next) => {
  try {
    const { resumeId } = req.body;

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found." });
    }

    const resumeText = extractTextFromResume(resume);
    const completion = resume.completionPercentage;

    const prompt = `You are a professional resume coach. Analyze this resume and provide specific improvement tips.

RESUME CONTENT: ${resumeText}
COMPLETION: ${completion}%
TEMPLATE: ${resume.template}
ATS SCORE: ${resume.atsScore?.overall || "Not analyzed"}

Provide personalized, actionable improvement tips. Return ONLY valid JSON:
{
  "quickWins": [
    {"tip": "Add your LinkedIn URL", "impact": "high", "effort": "low"},
    {"tip": "Quantify your achievements", "impact": "high", "effort": "medium"}
  ],
  "contentImprovements": [
    "Strengthen action verbs in experience section",
    "Add a more compelling professional summary"
  ],
  "formatImprovements": [
    "Consider adding a skills section",
    "Break long paragraphs into bullet points"
  ],
  "missingInformation": ["Phone number", "GitHub profile", "Portfolio link"],
  "priorityScore": 85,
  "estimatedImprovement": "Following these tips could increase your ATS score by 15-20 points",
  "nextStep": "The most impactful next step is to..."
}`;

    const rawResponse = await callGemini(prompt);

    let tips;
    try {
      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      tips = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      tips = { contentImprovements: [rawResponse] };
    }

    res.status(200).json({
      success: true,
      message: "Improvement tips generated! 💡",
      data: { tips },
    });
  } catch (error) {
    next(error);
  }
};