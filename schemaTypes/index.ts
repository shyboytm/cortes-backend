import {clientType} from './clientType'
import {feedItemType} from './feedItemType'
import {musicReleaseType} from './musicReleaseType'
import {pageType} from './pageType'
import {postType} from './postType'
import {pressMentionType} from './pressMentionType'
import {productType} from './productType'
import {recommendationType} from './recommendationType'
import {serviceType} from './serviceType'
import {testimonialType} from './testimonialType'
import {workType} from './workType'

// Array is in alphabetical order by document title (Client, Feed, Music
// Release, Page, Post, Press Mention, Recommendation, Service, Testimonial,
// Work). The Studio's default document list follows this array's order.
export const schemaTypes = [
  clientType,
  feedItemType,
  musicReleaseType,
  pageType,
  postType,
  pressMentionType,
  productType,
  recommendationType,
  serviceType,
  testimonialType,
  workType,
]
