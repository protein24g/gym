import { FC } from "react"
import Card from "../../components/ui/Card"
import StudentList from "../../components/students/StudentList"

const StudentsPage: FC = () => {
  return (
    <>
      <StudentList />
      <Card>
          <span className="text-lg xl:text-2xl my-2 font-bold">PT 신청자 목록 구현 예정</span>
      </Card>
    </>
  )
}

export default StudentsPage
