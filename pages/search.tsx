import Head from 'next/head';
import Layout from '../components/layout/layout';
import {getSearchData, PostPreview as Preview} from '../lib/server/posts';
import {NextRouter, withRouter} from 'next/router';
import {Component} from 'react';
import lunr from 'lunr';
import * as queryString from 'querystring';
import PostPreview from '../components/post/post-preview';
import {getTitle} from '../lib/util';

interface SearchProps {
    searchIndex: string;
    references: Array<Preview>,
    router: NextRouter
}

interface SearchState {
    loading: boolean;
    query: string;
    results: Array<Preview>;
}

const notFoundDummyPost: Preview = {
    slug: null,
    publishDate: null,
    teaserText:
        'The search-engine tried as hard as it possibly could but even with all that effort it came back empty handed. ' +
        'But you could always give it another try and find something different that might interest you.',
    title: 'No results found :(',
    postImage: '/assets/img/404.jpg',
    tags: [],
};

class Search extends Component<SearchProps, SearchState> {

    private parsedIndex: lunr.Index;

    constructor(props: SearchProps) {
        super(props);
        this.state = {query: '', loading: false, results: []};
    }

    componentDidMount() {
        const {searchIndex, router} = this.props;
        this.parsedIndex = lunr.Index.load(JSON.parse(searchIndex));
        // todo: remove when nextJS finally properly handles query params on mount
        const parsedQueryString = queryString.parse(router.asPath.split(/\?/)[1]);
        const query = this.normalizeQuery(parsedQueryString.query);
        this.setState({query}, this.performSearch.bind(this));
    }

    componentDidUpdate(prevProps: Readonly<SearchProps>, prevState: Readonly<SearchState>, snapshot?: any) {
        const {router} = this.props;
        if (router.query.query !== prevProps.router.query.query) {
            const query = this.normalizeQuery(router.query.query);
            if (query !== prevState.query) {
                this.setState({query}, this.performSearch.bind(this));
            }
        }
    }

    private normalizeQuery(query: string | string[]): string {
        if (typeof query !== 'string' && !Array.isArray(query)) {
            return '';
        }

        return typeof query === 'string' ? query : query.join(' ');
    }

    private performSearch() {
        const matches: Array<lunr.Index.Result> = this.parsedIndex.search(this.state.query);
        const results = matches.map(match =>
            this.props.references.find(ref => ref.slug === match.ref));
        this.setState({results})
    }

    private renderResults(): JSX.Element {
        if (this.state.results.length < 1) {
            return <PostPreview post={notFoundDummyPost}/>
        }

        return (
            <div>
                {this.state.results.map(res => (
                    <div key={res.slug}>
                        <PostPreview post={res}/>
                    </div>
                ))}
            </div>
        );
    }

    render() {
        return (
            <Layout>
                <Head>
                    <title>{getTitle('Search results')}</title>
                </Head>
                {this.renderResults()}
            </Layout>
        );
    }

}

export default withRouter(Search);

export async function getStaticProps({params}) {
    const searchData = getSearchData();
    return {
        props: {
            searchIndex: searchData.index,
            references: searchData.references,
        },
    };
}
