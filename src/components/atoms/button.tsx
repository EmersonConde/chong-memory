type props = {
    label: string
    className: string

}
export default function Button({ label, className }: props) {
    return (
        <button className={`max-w-[300px] min-w-[300px] relative group overflow-hidden px-12 h-16 rounded-md before:absolute before:inset-0 before:scale-y-[0.1] before:origin-bottom before:transition before:duration-300 hover:before:scale-y-100 ${className}`}>
            <span className="relative uppercase text-[24px] text-white">{label}</span>
        </button>
    )
}