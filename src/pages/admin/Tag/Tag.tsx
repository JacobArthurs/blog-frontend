import { useParams } from 'react-router-dom'

function Tag() {
  const { id } = useParams()

  if (id) {
    return <div>Admin: edit tag with ID {id}</div>
  } else {
    return <div>Admin: create new tag</div>
  }
}

export default Tag
