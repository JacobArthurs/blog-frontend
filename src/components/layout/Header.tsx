function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Blog</h1>
          <div className="flex gap-6">
            <a href="/" className="text-gray-700 hover:text-indigo-600">
              Home
            </a>
            <a href="/posts" className="text-gray-700 hover:text-indigo-600">
              Posts
            </a>
            <a href="/about" className="text-gray-700 hover:text-indigo-600">
              About
            </a>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
