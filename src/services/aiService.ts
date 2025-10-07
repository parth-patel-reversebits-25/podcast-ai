interface PodcastConfig {
  files: File[]
  length: string
  tone: string
  audience: string
  focusAreas: string
  depthLevel: string
  hostVoice: string
  guestVoice: string
}

/**
 * Process podcast configuration and file data
 */
export async function processPodcastData(config: PodcastConfig): Promise<void> {
  console.log('=== Podcast Configuration ===')
  console.log('Length:', config.length)
  console.log('Tone:', config.tone)
  console.log('Audience:', config.audience)
  console.log('Focus Areas:', config.focusAreas)
  console.log('Depth Level:', config.depthLevel)
  console.log('Host Voice:', config.hostVoice)
  console.log('Guest Voice:', config.guestVoice)

  console.log('\n=== Uploaded Files ===')
  console.log('Number of files:', config.files.length)

  config.files.forEach((file, index) => {
    console.log(`\nFile ${index + 1}:`)
    console.log('  Name:', file.name)
    console.log('  Size:', file.size, 'bytes')
    console.log('  Type:', file.type)
    console.log('  Last Modified:', new Date(file.lastModified).toISOString())
  })
}

export type { PodcastConfig }
