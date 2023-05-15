import { getProject } from '@/server/actions'
import { Project } from '@prisma/client'
import { useRouter } from 'next/router'

type ProjectDetailPageProp = {
    project: Project
}

export default function Page() {
    const router = useRouter()
    console.log(router.query.project_id)
    return <div>dsaada</div>
}
