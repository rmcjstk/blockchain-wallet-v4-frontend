import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { CombinedError, UseQueryState } from 'urql'

import { Button, SpinningLoader } from 'blockchain-info-components'
import { CollectionsQuery } from 'generated/graphql'

import { Centered, Grid } from '../../components'
import GraphqlError from '../../components/GraphqlError'
import { NftFilterFormValuesType } from '../../NftFilter'
import CollectionItemsResults from './CollectionItems.results'

const CollectionItems: React.FC<Props> = ({ collectionsQuery, formValues, slug }) => {
  const [pageVariables, setPageVariables] = useState([{ page: 0 }])
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(true)
  const [errorFetchingNextPage, setNextPageFetchError] = useState<CombinedError | undefined>(
    undefined
  )

  useEffect(() => {
    setIsFetchingNextPage(true)
    setPageVariables([])
    setTimeout(() => {
      setPageVariables([{ page: 0 }])
    }, 100)
  }, [slug, formValues])

  return (
    <>
      <Grid>
        {pageVariables.length
          ? pageVariables.map(({ page }) => (
              <CollectionItemsResults
                page={page}
                // @ts-ignore
                formValues={formValues}
                key={page}
                slug={slug}
                setNextPageFetchError={setNextPageFetchError}
                setIsFetchingNextPage={setIsFetchingNextPage}
              />
            ))
          : null}
      </Grid>
      <Centered>
        <GraphqlError error={errorFetchingNextPage} />
        {isFetchingNextPage || collectionsQuery.fetching ? (
          <SpinningLoader width='14px' height='14px' borderWidth='3px' />
        ) : (
          <Button
            onClick={() => setPageVariables((pages) => [...pages, { page: pages.length + 1 }])}
            nature='primary'
            data-e2e='loadMoreNfts'
          >
            {errorFetchingNextPage ? (
              <FormattedMessage id='copy.retry' defaultMessage='Retry' />
            ) : (
              <FormattedMessage id='copy.load_more' defaultMessage='Load More' />
            )}
          </Button>
        )}
      </Centered>
    </>
  )
}

type Props = {
  collectionsQuery: UseQueryState<CollectionsQuery, object>
  formValues: NftFilterFormValuesType
  slug: string
}

export default CollectionItems