import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ViewProject = () => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    technologies: [],
    stack: "",
    gitRepoLink: "",
    deployed: "",
    projectLink: "",
    projectBanner: ""
  });

  const { id } = useParams();
  const navigateTo = useNavigate();

  useEffect(() => {
    const getProject = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/project/get/${id}`,
          { withCredentials: true }
        );

        setProject({
          title: data.project.title || "",
          description: data.project.description || "",
          stack: data.project.stack || "",
          deployed: data.project.deployed || "",
          // Accept technologies as array or string
          technologies: Array.isArray(data.project.technologies)
            ? data.project.technologies
            : typeof data.project.technologies === "string"
            ? data.project.technologies.split(",").map(t => t.trim())
            : [],
          gitRepoLink: data.project.gitRepoLink || "",
          projectLink: data.project.projectLink || "",
          projectBanner: data.project.projectBanner?.url || ""
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch project");
      }
    };
    getProject();
  }, [id]);

  // Split description safely into sentences
  const descriptionList = project.description
    ? project.description.split(".").map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="flex mt-7 justify-center items-center min-h-[100vh] sm:gap-4 sm:py-4">
      <div className="w-full px-5 md:w-[1000px] pb-5">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="flex justify-end">
              <Button onClick={() => navigateTo("/")}>
                Return to Dashboard
              </Button>
            </div>
            <div className="mt-10 flex flex-col gap-5">
              <div className="w-full sm:col-span-4">
                <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
                <img
                  src={project.projectBanner || "/avatarHolder.jpg"}
                  alt="projectBanner"
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Description:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {descriptionList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Technologies:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {project.technologies.map((tech, index) => (
                    <li key={index}>{tech}</li>
                  ))}
                </ul>
              </div>
              <div className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Stack:</p>
                <p>{project.stack}</p>
              </div>
              <div className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Deployed:</p>
                <p>{project.deployed}</p>
              </div>
              <div className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Github Repository Link:</p>
                <a
                  href={project.gitRepoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-700 hover:underline break-all"
                >
                  {project.gitRepoLink}
                </a>
              </div>
              {project.projectLink && (
                <div className="w-full sm:col-span-4">
                  <p className="text-2xl mb-2">Project Link:</p>
                  <a
                    href={project.projectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-700 hover:underline break-all"
                  >
                    {project.projectLink}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProject;
