import Navbar from "@/src/components/Navbar"
import React, { FC } from "react"
import Footer from "@/src/components/Footer"

const Index: FC = () => {
  const services = [
    { img: "/create-room.svg", title: "ระบบสร้างห้อง" },
    { img: "/invite.svg", title: "ระบบเชิญเพื่อน" },
    { img: "/add-task.svg", title: "ระบบเพิ่มรายการ" },
    { img: "/friend's-task.svg", title: "ระบบรายการของเพื่อน" },
  ]

  return (
    <div>
      <Navbar />
      <div className="container my-16 flex flex-col space-y-12">
        <img src="/task-together.svg" alt="" className="w-full" />

        <div>
          <h4 className="text-xl">Sharekan (แชร์กัน)</h4>
          <p style={{ textIndent: 12 }}>
            แพลทฟอร์มบริหารการใช้เงิน โดยสามารถใช้งานร่วมกับเพื่อนได้{" "}
          </p>
        </div>

        <div>
          <h4 className="text-xl">ระบบของเรา</h4>
          <div className="grid grid-cols-2 gap-5">
            {services.map((e, i) => (
              <div key={i} className="flex flex-col items-center">
                <img src={e.img} alt="" className="h-32" />
                <span>{e.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Index
