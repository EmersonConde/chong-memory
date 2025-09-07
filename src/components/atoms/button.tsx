type props = {
    label: string
}
export default function Button({ label}: props) {
    return (
        <button className="max-w-[300px] min-w-[300px] relative group overflow-hidden px-12 h-16 rounded-md bg-[#6C30D3] before:absolute before:inset-0 before:bg-[#3d324e] before:scale-y-[0.1] before:origin-bottom before:transition before:duration-300 hover:before:scale-y-100">
            <span className="relative uppercase text-[24px] text-white">{label}</span>
        </button>
    )
}