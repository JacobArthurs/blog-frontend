import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface TimeAgoProps {
  dateString: string
  className?: string
}

export function TimeAgo({ dateString, className = '' }: TimeAgoProps) {
  const timeAgo = (dateString: string) => {
    const now = new Date()
    const past = new Date(dateString)
    const secondsAgo = Math.floor((now.getTime() - past.getTime()) / 1000)

    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    }

    for (const interval in intervals) {
      const intervalSeconds = intervals[interval]
      if (secondsAgo >= intervalSeconds) {
        const count = Math.floor(secondsAgo / intervalSeconds)
        return `${count} ${interval}${count !== 1 ? 's' : ''} ago`
      }
    }

    return 'just now'
  }

  const formatAbsoluteDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`cursor-help ${className}`}>
          {timeAgo(dateString)}
        </span>
      </TooltipTrigger>
      <TooltipContent>{formatAbsoluteDate(dateString)}</TooltipContent>
    </Tooltip>
  )
}
