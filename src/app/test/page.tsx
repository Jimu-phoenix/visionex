"use client"

export default function test(){
    return(
        <main className="w-full h-lvh p-0 m-0 flex bg-black">
            <div className="w-1/2 h-full bg-black"></div>
            <div className="w-1/2 h-full bg-blue-700 rounded-l-3xl overflow-y-hidden">
            <img src="images/phoenix-secondary.png" alt="" width={1000}/>
            </div>
        </main>
    )
}