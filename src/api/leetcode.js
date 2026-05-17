/**
 * LeetCode GraphQL API integration.
 * Uses a CORS proxy since LeetCode's API doesn't support browser requests directly.
 */

const LEETCODE_API = 'https://leetcode.com/graphql'
const CORS_PROXY = 'https://corsproxy.io/?'

const USER_PROFILE_QUERY = `
query userPublicProfile($username: String!) {
  matchedUser(username: $username) {
    username
    githubUrl
    twitterUrl
    linkedinUrl
    profile {
      ranking
      userAvatar
      realName
      aboutMe
      school
      websites
      countryName
      company
      jobTitle
      skillTags
      postViewCount
      postViewCountDiff
      reputation
      reputationDiff
      solutionCount
      solutionCountDiff
      categoryDiscussCount
      categoryDiscussCountDiff
    }
    submitStats: submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    badges {
      id
      name
      shortName
      displayName
      icon
      hoverText
      medal {
        slug
        config {
          iconGif
          iconGifBackground
        }
      }
      creationDate
      category
    }
    activeBadge {
      id
      displayName
    }
    userCalendar(year: 2024) {
      activeYears
      streak
      totalActiveDays
      dccBadges {
        timestamp
        badge {
          name
          icon
        }
      }
      submissionCalendar
    }
  }
  userContestRanking(username: $username) {
    attendedContestsCount
    rating
    globalRanking
    totalParticipants
    topPercentage
    badge {
      name
    }
  }
}
`

const USER_PROBLEMS_QUERY = `
query userSolvedProblems($username: String!, $limit: Int!) {
  recentAcSubmissionList(username: $username, limit: $limit) {
    id
    title
    titleSlug
    timestamp
    statusDisplay
    lang
    runtime
    memory
  }
}
`

const TOPIC_STATS_QUERY = `
query userTopicTags($username: String!) {
  matchedUser(username: $username) {
    tagProblemCounts {
      advanced {
        tagName
        tagSlug
        problemsSolved
      }
      intermediate {
        tagName
        tagSlug
        problemsSolved
      }
      fundamental {
        tagName
        tagSlug
        problemsSolved
      }
    }
  }
}
`

async function graphqlRequest(query, variables) {
  const url = CORS_PROXY + encodeURIComponent(LEETCODE_API)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://leetcode.com',
      'Referer': 'https://leetcode.com',
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`)
  }

  const json = await response.json()
  if (json.errors) {
    throw new Error(json.errors[0]?.message || 'GraphQL error')
  }
  return json.data
}

export async function fetchLeetCodeProfile(username) {
  const [profileData, topicData, recentData] = await Promise.allSettled([
    graphqlRequest(USER_PROFILE_QUERY, { username }),
    graphqlRequest(TOPIC_STATS_QUERY, { username }),
    graphqlRequest(USER_PROBLEMS_QUERY, { username, limit: 20 }),
  ])

  const profile = profileData.status === 'fulfilled' ? profileData.value : null
  const topics = topicData.status === 'fulfilled' ? topicData.value : null
  const recent = recentData.status === 'fulfilled' ? recentData.value : null

  if (!profile?.matchedUser) {
    throw new Error(`User "${username}" not found on LeetCode`)
  }

  return {
    user: profile.matchedUser,
    contestRanking: profile.userContestRanking,
    topics: topics?.matchedUser?.tagProblemCounts,
    recentSubmissions: recent?.recentAcSubmissionList || [],
  }
}
