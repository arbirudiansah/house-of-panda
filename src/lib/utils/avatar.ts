export default function generateAvatar(id?: string) {
    return `https://avatars.dicebear.com/api/big-ears-neutral/${id ?? 'hop'}.svg`;
}