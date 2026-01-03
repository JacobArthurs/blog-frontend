import { useParams } from 'react-router-dom'

function Tag() {
  const { slug } = useParams()

  return (
    <div>
      <h1>Tag: {slug}</h1>
      <p>List of Posts with tag will appear here</p>
    </div>
  )
}

export default Tag
