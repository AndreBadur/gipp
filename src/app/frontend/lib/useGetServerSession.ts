import { getServerSession } from "next-auth";

export default async function useGetServerSession() {
    const session = await getServerSession()
    return {session}
}