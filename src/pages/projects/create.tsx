import dynamic from 'next/dynamic';

type ProjectCreatePageProp = {};

const ProjectCreateClient = dynamic(
    () => import('../../components/Projects/ProjectCreate'),
    {
        ssr: false,
    }
);

export default function Page(props: ProjectCreatePageProp) {
    return <ProjectCreateClient />;
}
