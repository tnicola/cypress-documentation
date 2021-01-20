/// <reference types="cypress" />
import { getAssetCacheHash, addAssetCacheHash } from './utils'

const YAML = require('yamljs')

describe('Examples', () => {
  describe('Test Utilities', () => {
    const hash = '7e135988'

    it('extract asset cache hash from img src', () => {
      const src = `/img/examples/cypress-optimizely.${hash}.png`
      const imgEl = document.createElement('img')

      imgEl.setAttribute('src', src)

      expect(getAssetCacheHash(Cypress.$(imgEl))).to.equal(hash)
    })

    it('add asset cache hash to img src', () => {
      const src = '/img/examples/cypress-optimizely.png'

      expect(addAssetCacheHash(src, hash)).to.equal(`/img/examples/cypress-optimizely.${hash}.png`)
    })
  })

  describe('Projects', () => {
    let projects = []

    before(() => {
      let projectsYaml = 'source/_data/projects.yml'

      cy.readFile(projectsYaml)
      .then(function (yamlString) {
        projects = YAML.parse(yamlString)
      })
    })

    beforeEach(() => {
      cy.visit('examples/examples/projects-media.html')
      cy.contains('.article-title', 'Projects').should('be.visible')
    })

    it('lists projects', function () {
      cy.get('.projects-list li').each((projectEl, i) => {
        cy.wrap(projects[i]).then((project) => {
          cy.wrap(projectEl).within(() => {
            cy.root()
            .contains('a', project.name)
            .should('have.attr', 'href', project.url)

            cy.root()
            .contains(project.description)
          })
        })
      })
    })
  })

  describe('Courses', () => {
    let courses = []

    before(() => {
      let coursesYaml = 'source/_data/courses.yml'

      cy.readFile(coursesYaml)
      .then(function (yamlString) {
        courses = YAML.parse(yamlString)
      })
    })

    beforeEach(() => {
      cy.visit('examples/media/courses-media.html')
      cy.contains('.article-title', 'Courses').should('be.visible')
    })

    it('lists courses', function () {
      cy.get('.courses-list li').each((courseEl, i) => {
        cy.wrap(courses[i]).then((course) => {
          cy.wrap(courseEl).within(() => {
            cy.root()
            .contains('a', course.title)
            .should('have.attr', 'href', course.url)

            cy.root()
            .contains(course.author)

            if (course.authorTwitter) {
              cy.root()
              .find(`a[href="https://twitter.com/${course.authorTwitter}"]`)
            }

            if (course.sourceUrl) {
              cy.root()
              .find(`a[href="${course.sourceUrl}"]`)
              .contains(course.sourceName)
            }

            if (course.free) {
              cy.root().contains('Free')
            }

            if (course.language) {
              cy.root().contains(course.language)
            }
          })
        })
      })
    })
  })

  describe('Webinars', () => {
    let webinars = []

    before(() => {
      let webinarsYaml = 'source/_data/webinars.yml'

      cy.readFile(webinarsYaml)
      .then(function (yamlString) {
        webinars = YAML.parse(yamlString)
      })
    })

    beforeEach(() => {
      cy.visit('examples/media/webinars-media.html')
      cy.contains('.article-title', 'Webinars').should('be.visible')
    })

    it('lists webinars', function () {
      const linkTypes = ['small', 'large']

      cy.wrap(linkTypes).each((linkType) => {
        const selector = linkType === 'large' ? '.media' : ''

        cy.get(`.media-${linkType} ${selector}`).each((webinarEl, i) => {
          cy.wrap(webinars[linkType][i]).then((webinar) => {
            cy.wrap(webinarEl).within(() => {
              if (linkType === 'small') {
                cy.root()
                .contains('a', webinar.title)
                .should('have.attr', 'href', webinar.sourceUrl)
              } else {
                cy.root()
                .contains('a', webinar.title)
                .should('have.attr', 'href', `https://www.youtube.com/watch?v=${webinar.youtubeId}`)
              }
            })
          })
        })
      })
    })
  })

  describe('Podcasts', () => {
    let podcasts = []

    before(() => {
      let podcastsYaml = 'source/_data/podcasts.yml'

      cy.readFile(podcastsYaml).then(function (yamlString) {
        podcasts = YAML.parse(yamlString)
      })
    })

    beforeEach(() => {
      cy.visit('examples/media/podcasts-media.html')
      cy.contains('.article-title', 'Podcasts').should('be.visible')
    })

    it('lists podcasts', function () {
      cy.get('.media-large .media').each((podcastEl, i) => {
        cy.wrap(podcasts.large[i]).then((podcast) => {
          cy.wrap(podcastEl).within(() => {
            if (podcast.youtubeId) {
              cy.root()
              .find(`a[href='https://www.youtube.com/watch?v=${podcast.youtubeId}']`)
              .contains(podcast.title)
            } else if (podcast.url) {
              cy.root()
              .find(`a[href='${podcast.url}']`)
              .contains(podcast.title)

              cy.root().find('img').then(($img) => {
                const assetHash = getAssetCacheHash($img)
                const imgSrc = assetHash.length
                  ? addAssetCacheHash(podcast.img, assetHash)
                  : podcast.img

                expect($img).to.have.attr('src', imgSrc)
                cy.request(Cypress.config('baseUrl') + imgSrc).its('status').should('equal', 200)
              })
            }
          })
        })
      })
    })
  })

  describe('Screencasts', () => {
    let screencasts = []

    beforeEach(() => {
      let screencastsYaml = 'source/_data/screencasts.yml'

      cy.readFile(screencastsYaml).then(function (yamlString) {
        screencasts = YAML.parse(yamlString)
      })

      cy.visit('examples/media/screencasts-media.html')
      cy.contains('.article-title', 'Screencasts').should('be.visible')
    })

    it('lists screencasts', function () {
      cy.get('.media-large .media').each((screencastEl, i) => {
        cy.wrap(screencasts.large[i]).then((screencast) => {
          cy.wrap(screencastEl).within(() => {
            if (screencast.youtubeId) {
              cy.root()
              .find(`a[href='https://www.youtube.com/watch?v=${screencast.youtubeId}']`)
              .contains(screencast.title)
            } else if (screencast.url) {
              cy.root()
              .find(`a[href='${screencast.url}']`)
              .contains(screencast.title)

              cy.root().find('img').then(($img) => {
                const assetHash = getAssetCacheHash($img)
                const imgSrc = assetHash.length
                  ? addAssetCacheHash(screencast.img, assetHash)
                  : screencast.img

                expect($img).to.have.attr('src', imgSrc)
                cy.request(Cypress.config('baseUrl') + imgSrc).its('status').should('equal', 200)
              })
            }
          })
        })
      })
    })
  })
})
