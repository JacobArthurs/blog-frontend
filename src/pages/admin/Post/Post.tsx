import { useParams } from 'react-router-dom'

function Post() {
  const { id } = useParams()

  if (id) {
    return <div>Admin: edit post with ID {id}</div>
  } else {
    return <div>Admin: create new post</div>
  }
}

export default Post
