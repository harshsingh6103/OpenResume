import { Fragment } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeSlice";
import { selectSettings } from "lib/redux/settingsSlice";

const ExperienceSection = ({ experiences }: { experiences: any[] }) => (
  <div>
    {experiences.map((item, idx) => (
      <div key={idx} className="mb-2">
        <div className="font-bold">{item.company}</div>
        <div>{item.jobTitle}</div>
        <div className="text-sm text-gray-500">{item.date}</div>
        <div className="text-sm">{item.descriptions?.join(", ")}</div>
      </div>
    ))}
  </div>
);

const EducationSection = ({ educations }: { educations: any[] }) => (
  <div>
    {educations.map((item, idx) => (
      <div key={idx} className="mb-2">
        <div className="font-bold">{item.school}</div>
        <div>{item.studyType} in {item.area}</div>
        <div className="text-sm text-gray-500">{item.date}</div>
        <div className="text-sm">{item.descriptions?.join(", ")}</div>
      </div>
    ))}
  </div>
);

const ProjectSection = ({ projects }: { projects: any[] }) => (
  <div>
    {projects.map((item, idx) => (
      <div key={idx} className="mb-2">
        <div className="font-bold">{item.project}</div>
        <div className="text-sm">{item.descriptions?.join(", ")}</div>
        <div className="text-sm text-gray-500">{item.date}</div>
      </div>
    ))}
  </div>
);

const SkillsSection = ({ skills }: { skills: any }) => (
  <div>
    {skills.featuredSkills?.map((item: any, idx: number) => (
      <div key={idx} className="font-bold mb-1">{item.skill}</div>
    ))}
  </div>
);

const CustomSectionBlock = ({ custom }: { custom: any }) => (
  <div>
    <div className="font-bold">{custom.heading}</div>
    <div>{custom.descriptions?.join(", ")}</div>
  </div>
);

const mapSectionToComponent = (section: string, resume: any) => {
  switch (section) {
    case "workExperiences": return <ExperienceSection experiences={resume.workExperiences} />;
    case "educations": return <EducationSection educations={resume.educations} />;
    case "projects": return <ProjectSection projects={resume.projects} />;
    case "skills": return <SkillsSection skills={resume.skills} />;
    case "custom": return <CustomSectionBlock custom={resume.custom} />;
    default:
      return null;
  }
};

export const ResumeWebTemplate = ({ columns, isFirstPage = false }: { columns?: string[][], isFirstPage?: boolean }) => {
  const resume = useAppSelector(selectResume);
  const settings = useAppSelector(selectSettings);
  // Use formsOrder and formToShow from settings to determine columns if not provided
  let main: string[] = [];
  let sidebar: string[] = [];
  if (Array.isArray(columns) && columns.length === 2 && Array.isArray(columns[0]) && Array.isArray(columns[1])) {
    [main, sidebar] = columns;
  } else {
    // Fallback: all sections in main column
    main = settings.formsOrder.filter((form) => settings.formToShow[form]);
    sidebar = [];
  }

  return (
    <div className="p-custom space-y-6">
      {/* Optionally add a header here using resume.profile */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          {main.map((section) => (
            <Fragment key={section}>{mapSectionToComponent(section, resume)}</Fragment>
          ))}
        </div>
        <div className="col-span-1 space-y-4">
          {sidebar.map((section) => (
            <Fragment key={section}>{mapSectionToComponent(section, resume)}</Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
