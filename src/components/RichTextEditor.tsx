import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { common, createLowlight } from 'lowlight'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Undo2,
  Redo2,
  Heading1,
  Heading2,
  Heading3,
  FileCode,
  Link as LinkIcon,
  ImageIcon,
  ALargeSmall
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useState, useEffect } from 'react'
import type { UploadResponse } from '@/types/uploads'
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { LinkDialog } from '@/components/LinkDialog'
import { ImageDialog } from '@/components/ImageDialog'

const lowlight = createLowlight(common)

interface RichTextEditorConfig {
  enableImages?: boolean
  enableLinks?: boolean
  enableHeadings?: boolean
  enableCodeBlocks?: boolean
  enableInlineCode?: boolean
  enableLists?: boolean
  enableBlockquote?: boolean
  enableBold?: boolean
  enableItalic?: boolean
  enableStrike?: boolean
}

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  editable?: boolean
  config?: RichTextEditorConfig
}

export function RichTextEditor({
  content,
  onChange,
  placeholder,
  editable = true,
  config = {}
}: RichTextEditorProps) {
  const {
    enableImages = true,
    enableLinks = true,
    enableHeadings = true,
    enableCodeBlocks = true,
    enableInlineCode = true,
    enableLists = true,
    enableBlockquote = true,
    enableBold = true,
    enableItalic = true,
    enableStrike = true
  } = config
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [initialLinkUrl, setInitialLinkUrl] = useState('')
  const [initialLinkText, setInitialLinkText] = useState('')
  const [showToolbar, setShowToolbar] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: enableHeadings ? undefined : false,
        bulletList: enableLists ? undefined : false,
        orderedList: enableLists ? undefined : false,
        blockquote: enableBlockquote ? undefined : false,
        bold: enableBold ? undefined : false,
        italic: enableItalic ? undefined : false,
        strike: enableStrike ? undefined : false,
        code: enableInlineCode ? undefined : false
      }),
      ...(enableCodeBlocks
        ? [
            CodeBlockLowlight.configure({
              lowlight
            })
          ]
        : []),
      Placeholder.configure({
        placeholder: placeholder || 'Write something...'
      }),
      ...(enableLinks
        ? [
            Link.configure({
              openOnClick: false
            })
          ]
        : []),
      ...(enableImages
        ? [
            Image.configure({
              inline: true
            })
          ]
        : [])
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    }
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '')
    }
  }, [editor, content])

  if (!editor) {
    return null
  }

  const openLinkDialog = () => {
    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to, '')
    const previousUrl = editor.getAttributes('link').href || ''

    setInitialLinkUrl(previousUrl)
    setInitialLinkText(selectedText)
    setLinkDialogOpen(true)
  }

  const handleLinkConfirm = (url: string, text: string) => {
    let normalizedUrl = url.trim()
    if (!normalizedUrl.match(/^[a-zA-Z][a-zA-Z\d+\-.]*:/)) {
      normalizedUrl = 'http://' + normalizedUrl
    }

    const { from, to } = editor.state.selection
    const hasSelection = from !== to
    const isInsideLink = editor.isActive('link')

    if (hasSelection || isInsideLink) {
      if (isInsideLink && !hasSelection) {
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({ href: normalizedUrl })
          .run()
      } else {
        editor.chain().focus().setLink({ href: normalizedUrl }).run()
      }
    } else {
      const textToInsert = text || url
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'text',
          text: textToInsert,
          marks: [
            {
              type: 'link',
              attrs: {
                href: normalizedUrl
              }
            }
          ]
        })
        .run()
    }
  }

  const handleImageConfirm = async (urlOrFile: string | File) => {
    try {
      setIsUploading(true)

      let finalUrl: string

      if (urlOrFile instanceof File) {
        const formData = new FormData()
        formData.append('file', urlOrFile)

        const token = sessionStorage.getItem('access_token')
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

        const response = await fetch(`${apiBaseUrl}/uploads/photos`, {
          method: 'POST',
          headers: {
            ...(token && { Authorization: `Bearer ${token}` })
          },
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(errorData?.detail || 'Failed to upload image')
        }

        const data: UploadResponse = await response.json()
        finalUrl = `${apiBaseUrl}${data.url}`
      } else {
        finalUrl = urlOrFile
      }

      editor.chain().focus().setImage({ src: finalUrl }).run()
      setImageDialogOpen(false)
      toast.success('Image added successfully')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to upload image'
      toast.error(message)
    } finally {
      setIsUploading(false)
    }
  }

  const addImage = () => {
    setImageDialogOpen(true)
  }

  const ToolbarButton = ({
    onClick,
    active,
    icon: Icon,
    title
  }: {
    onClick: () => void
    active?: boolean
    icon: React.ComponentType<{ size: number }>
    title: string
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={active ? 'default' : 'ghost'}
          size="sm"
          onClick={onClick}
          title={title}
          className="cursor-pointer"
        >
          <Icon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  )

  const FormattingToggleButton = () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowToolbar(!showToolbar)}
          className="cursor-pointer"
        >
          <ALargeSmall className="text-muted-foreground size-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {showToolbar ? 'Hide formatting options' : 'Show formatting options'}
      </TooltipContent>
    </Tooltip>
  )

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {showToolbar && (
        <div className="p-2 flex flex-wrap items-center gap-1">
          {enableBold && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              icon={Bold}
              title="Bold (Ctrl+B)"
            />
          )}
          {enableItalic && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              icon={Italic}
              title="Italic (Ctrl+I)"
            />
          )}
          {enableStrike && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive('strike')}
              icon={Strikethrough}
              title="Strikethrough"
            />
          )}
          {enableInlineCode && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              active={editor.isActive('code')}
              icon={Code}
              title="Inline Code"
            />
          )}
          {enableCodeBlocks && (
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive('codeBlock')}
              icon={FileCode}
              title="Code Block"
            />
          )}
          {enableLinks && (
            <ToolbarButton
              onClick={openLinkDialog}
              active={editor.isActive('link')}
              icon={LinkIcon}
              title="Add Link"
            />
          )}
          {enableImages && (
            <ToolbarButton
              onClick={addImage}
              active={editor.isActive('image')}
              icon={ImageIcon}
              title="Add Image"
            />
          )}

          {enableHeadings && (
            <>
              <Separator orientation="vertical" className="h-6!" />

              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                active={editor.isActive('heading', { level: 1 })}
                icon={Heading1}
                title="Heading 1"
              />
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                active={editor.isActive('heading', { level: 2 })}
                icon={Heading2}
                title="Heading 2"
              />
              <ToolbarButton
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                active={editor.isActive('heading', { level: 3 })}
                icon={Heading3}
                title="Heading 3"
              />
            </>
          )}

          {(enableLists || enableBlockquote) && (
            <>
              <Separator orientation="vertical" className="h-6!" />

              {enableLists && (
                <>
                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                    active={editor.isActive('bulletList')}
                    icon={List}
                    title="Bullet List"
                  />
                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                    active={editor.isActive('orderedList')}
                    icon={ListOrdered}
                    title="Ordered List"
                  />
                </>
              )}
              {enableBlockquote && (
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  active={editor.isActive('blockquote')}
                  icon={Quote}
                  title="Blockquote"
                />
              )}
            </>
          )}

          <Separator orientation="vertical" className="h-6!" />

          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            icon={Undo2}
            title="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            icon={Redo2}
            title="Redo"
          />

          <div className="ml-auto">
            <FormattingToggleButton />
          </div>
        </div>
      )}

      <div className="relative">
        <EditorContent
          editor={editor}
          className="prose prose-sm dark:prose-invert max-w-none"
        />

        {!showToolbar && (
          <div className="absolute top-2 right-2">
            <FormattingToggleButton />
          </div>
        )}
      </div>

      <ImageDialog
        open={imageDialogOpen}
        onOpenChange={setImageDialogOpen}
        onConfirm={handleImageConfirm}
        isUploading={isUploading}
      />

      <LinkDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        initialUrl={initialLinkUrl}
        initialText={initialLinkText}
        onConfirm={handleLinkConfirm}
      />
    </div>
  )
}
