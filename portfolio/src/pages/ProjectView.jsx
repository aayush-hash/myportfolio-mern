import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ProjectView = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [stack, setStack] = useState("");
  const [gitRepoLink, setGitRepoLink] = useState("");
  const [deployed, setDeployed] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [projectBanner, setProjectBanner] = useState("");
  const [projectBannerPreview, setProjectBannerPreview] = useState("");
  const { id } = useParams();
  const navigateTo = useNavigate();

  useEffect(() => {
    const getProject = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/project/get/${id}`, {
          withCredentials: true,
        });
        const project = res.data.project;
        setTitle(project.title);
        setDescription(project.description);
        setStack(project.stack);
        setDeployed(project.deployed);
        setTechnologies(project.technologies);
        setGitRepoLink(project.gitRepoLink);
        setProjectLink(project.projectLink);
        setProjectBanner(project.projectBanner && project.projectBanner.url);
        setProjectBannerPreview(project.projectBanner && project.projectBanner.url);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load project");
      }
    };
    getProject();
  }, [id]);

  // Safely parse description and technologies
  const descriptionList = description
    ? description.split(". ").filter(Boolean)
    : [];

  const technologiesList = Array.isArray(technologies)
    ? technologies
    : typeof technologies === "string" && technologies.length > 0
    ? technologies.split(", ").filter(Boolean)
    : [];

  const handleReturnToPortfolio = () => {
    navigateTo("/");
  };

  return (
    <>
      <div className="flex mt-7 justify-center items-center min-h-[100vh] sm:gap-4 sm:py-4">
        <div className="w-[100%] px-5 md:w-[1000px] pb-5">
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <div className="flex justify-end">
                <Button onClick={handleReturnToPortfolio}>
                  Return to Portfolio
                </Button>
              </div>
              <div className="mt-10 flex flex-col gap-5">
                <div className="w-full sm:col-span-4">
                  <h1 className="text-2xl font-bold mb-4">{title}</h1>
                  <img
                    src={projectBannerPreview ? projectBannerPreview : "/avatarHolder.jpg"}
                    alt="projectBanner"
                    className="w-full h-auto"
                  />
                </div>
                <div className="w-full sm:col-span-4">
                  <p className="text-2xl mb-2">Description:</p>
                  <ul className="list-disc">
                    {descriptionList.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="w-full sm:col-span-4">
                  <p className="text-2xl mb-2">Technologies:</p>
                  <ul className="list-disc">
                    {technologiesList.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="w-full sm:col-span-4">
                  <p className="text-2xl mb-2">Stack:</p>
                  <p>{stack}</p>
                </div>
                <div className="w-full sm:col-span-4">
                  <p className="text-2xl mb-2">Deployed:</p>
                  <p>{deployed}</p>
                </div>
                <div className="w-full sm:col-span-4">
                  <p className="text-2xl mb-2">Github Repository Link:</p>
                  <a
                    className="text-sky-700"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={gitRepoLink}
                  >
                    {gitRepoLink}
                  </a>
                </div>
                <div className="w-full sm:col-span-4">
                  <p className="text-2xl mb-2">Project Link:</p>
                  <a
                    className="text-sky-700"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={projectLink}
                  >
                    {projectLink}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectView;
