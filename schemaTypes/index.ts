import {clientType} from './clientType'
import {experienceType} from './experienceType'
import {feedItemType} from './feedItemType'
import {musicReleaseType} from './musicReleaseType'
import {pageType} from './pageType'
import {photoType} from './photoType'
import {postType} from './postType'
import {pressMentionType} from './pressMentionType'
import {productType} from './productType'
import {recommendationType} from './recommendationType'
import {serviceType} from './serviceType'
import {testimonialType} from './testimonialType'
import {workType} from './workType'

// Array is in alphabetical order by document title (Client, Experience,
// Feed, Music Release, Page, Photo, Post, Press Mention, Product,
// Recommendation, Service, Testimonial, Work). The Studio's default document
// list follows this array's order.
export const schemaTypes = [
  clientType,
  experienceType,
  feedItemType,
  musicReleaseType,
  pageType,
  photoType,
  postType,
  pressMentionType,
  productType,
  recommendationType,
  serviceType,
  testimonialType,
  workType,
]
