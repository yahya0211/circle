import { useParams } from "react-router-dom"
import { useAppSelector } from "../../../redux/store"

const {data: detailUser, isLoading, isError, error} = useAppSelector((state) => state.detailUser)
const params = useParams()
const jwtToken = localStorage.getItem("jwtToken")





const fetchFollowerData =async () => {
    const followers =detailUser
}