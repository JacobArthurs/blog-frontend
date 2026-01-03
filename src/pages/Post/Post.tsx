import { useParams } from 'react-router-dom'

function Post() {
  const { slug } = useParams()

  return (
    <div>
      <h1>Post: {slug}</h1>
      <p>Individual blog post content will appear here</p>
    </div>
  )
}

export default Post
