import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { SearchParameters, SearchResults } from 'src/app/types'
import { ErrorHandlerService } from '../error-handler/error-handler.service'
import { catchError, delay, map } from 'rxjs/operators'
import { DEFAULT_PAGE_SIZE, ORCID_REGEXP } from 'src/app/constants'

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  quickSearchEDisMax =
    // tslint:disable-next-line: max-line-length
    '{!edismax qf="given-and-family-names^50.0 family-name^10.0 given-names^10.0 credit-name^10.0 other-names^5.0 text^1.0" pf="given-and-family-names^50.0" bq="current-institution-affiliation-name:[* TO *]^100.0 past-institution-affiliation-name:[* TO *]^70" mm=1}'

  constructor(
    private _http: HttpClient,
    private _errorHandler: ErrorHandlerService
  ) {}

  search(querryParam: SearchParameters): Observable<SearchResults> {
    return of({
      'expanded-result': [
        {
          'orcid-id': '0000-0003-2963-5205',
          'given-names': '123',
          'family-names': '123',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0003-3283-5283',
          'given-names': '123',
          'family-names': null,
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0002-0109-4745',
          'given-names': 'Camelia',
          'family-names': 'Orcid',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': ['Test'],
        },
        {
          'orcid-id': '0000-0003-4328-3699',
          'given-names': '123',
          'family-names': 'rew',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0001-7179-2293',
          'given-names': '123',
          'family-names': 'asd',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0002-9225-6008',
          'given-names': 'Orcid',
          'family-names': 'Test',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0003-0246-4696',
          'given-names': 'JATest',
          'family-names': 'ORCID',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0001-7961-4408',
          'given-names': 'PTTest',
          'family-names': 'ORCID',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0001-9950-2243',
          'given-names': 'KOTest',
          'family-names': 'ORCID',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0002-6295-6708',
          'given-names': 'JATest2',
          'family-names': 'ORCID',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0001-9263-8244',
          'given-names': 'RUTest',
          'family-names': 'ORCID',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0002-2824-2525',
          'given-names': 'ITTest',
          'family-names': 'ORCID',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0002-1761-9809',
          'given-names': 'RUTest',
          'family-names': 'ORCID',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0002-2384-6207',
          'given-names': 'ZHTWTest',
          'family-names': 'ORCID',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0003-0407-0543',
          'given-names': 'FRtest',
          'family-names': 'ORCID',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0002-5914-889X',
          'given-names': 'ZHCNTest',
          'family-names': 'ORCID',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0002-4714-4613',
          'given-names': 'CSTest',
          'family-names': 'ORCID',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0003-1819-9508',
          'given-names': 'ZHTWTest',
          'family-names': 'ORCID',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0001-8940-9723',
          'given-names': 'Spanishtest',
          'family-names': 'ORCID',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0001-8743-8897',
          'given-names': 'test',
          'family-names': 'Orcid Test',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0003-2315-2747',
          'given-names': 'ORCID',
          'family-names': 'Indexing status test',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [],
        },
        {
          'orcid-id': '0000-0003-2872-8610',
          'given-names': 'Tertius',
          'family-names': 'Lydgate',
          'credit-name': null,
          'other-name': ['123', '987'],
          email: ['c.oyler+lyd@orcid.org', 'lydgate@mailinator.com'],
          'institution-name': [
            'Medibank Private',
            'Not from the list',
            'ORCID',
            'Trestletree Inc',
            'United States Department of the Navy',
          ],
        },
        {
          'orcid-id': '0000-0002-9309-9737',
          'given-names': 'Cheryl',
          'family-names': 'Sethate',
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [
            'Botswana Police Service',
            'ORCID',
            'University of Botswana',
            'University of Gaborone',
          ],
        },
        {
          'orcid-id': '0000-0002-2036-7905',
          'given-names': null,
          'family-names': null,
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': ['alphaXRT Pty Ltd', 'common:name'],
        },
        {
          'orcid-id': '0000-0002-8376-7201',
          'given-names': 'Mary-Kat',
          'family-names': null,
          'credit-name': null,
          'other-name': [
            'Also Know As',
            'The quick, brown fox jumps over a lazy dog.',
            'The quick, brown fox jumps over a lazy dog. DJs flock by when MTV ax quiz prog. Junk MTV quiz graced by fox whelps. Bawds jog, flick quartz, vex nymphs. Waltz, bad nymph, for quick jigs vex! Fox nymphs grab quick-jived waltz. Brick',
          ],
          email: [],
          'institution-name': [
            'Fondazione Opere Pie Riunite Di Codogno - Onlus',
            'Oakland Community College',
            'Samsung (South Korea)',
            'San Francisco State University',
            'Santa Barbara Business College',
            'University College London',
            'Биография',
            'سيرة شخصية',
            '簡歷',
          ],
        },
        {
          'orcid-id': '0000-0002-3874-7658',
          'given-names': 'Everything Public',
          'family-names': 'MA test',
          'credit-name': 'Published Name',
          'other-name': ['Also know As'],
          email: ['public_ma@mailinator.com'],
          'institution-name': [
            'Alpena Community College',
            'City of Austin',
            'City of Boston',
            'City of Madison Wisconsin',
            'New York City Council',
            'ORCID',
            'San Francisco Foundation',
          ],
        },
        {
          'orcid-id': '0000-0002-5773-9864',
          'given-names': null,
          'family-names': null,
          'credit-name': null,
          'other-name': ['Second Name'],
          email: ['rw@mailinator.com'],
          'institution-name': [
            'City of Houghton, Michgian',
            'Harvard University',
            'Keweenaw Org',
            'Public Schools of Calumet Laurium and Keweenaw',
          ],
        },
        {
          'orcid-id': '0000-0002-4927-0058',
          'given-names': 'Nov 1',
          'family-names': 'Test',
          'credit-name': 'test',
          'other-name': ['other name'],
          email: ['nov1@mailinator.com'],
          'institution-name': ['ORCID', 'Program 973'],
        },
        {
          'orcid-id': '0000-0003-3596-1971',
          'given-names': 'new 2',
          'family-names': 'Foo Foo',
          'credit-name': 'Credit',
          'other-name': ['Bunny D', 'EMMA!'],
          email: ['bunny@mailinator.com'],
          'institution-name': [
            '9N6',
            'Kings College London',
            'National Taiwan University Language Training and Testing Center',
            'University of Michigan',
          ],
        },
        {
          'orcid-id': '0000-0001-9861-6900',
          'given-names': 'Paula',
          'family-names': 'Demain',
          'credit-name': null,
          'other-name': ['P Demain', 'Demain P'],
          email: ['p.demain@orcid.org', 'p.demain1234@orcid.org'],
          'institution-name': [
            'Boston University',
            'John Wiley & Sons Inc',
            'John Wiley and Sons Ltd',
            'Kings College London',
            'Los Alamos National Laboratory',
            'Max Planck UCL Centre for Computational Psychiatry and Ageing Research',
            'NiSource Inc',
            'ORCID',
            'ORCID Inc',
            'UCLA Molecular Biology Institute',
          ],
        },
        {
          'orcid-id': '0000-0002-4676-4490',
          'given-names': 'N',
          'family-names': 'Wolfe',
          'credit-name': 'Nero Wolfe',
          'other-name': ['Nero 2'],
          email: [
            'c.oyler+nero@orcid.org',
            'c.oyler+5@orcid.org',
            'c.oyler+nero3@orcid.org',
          ],
          'institution-name': [
            'Andrew W. Mellon Foundation',
            'Beijing Polytechnic',
            'Inst',
            'Iraq Virtual Science Library',
            'LG Display',
            'ORCID',
            'Program 973',
            'Public Schools of Calumet Laurium and Keweenaw',
            'US Department of the Navy',
            'United States Department of the Navy',
            'Universities of Michiganer',
            'University of Michigan',
          ],
        },
        {
          'orcid-id': '0000-0003-2742-2353',
          'given-names': 'lllocked',
          'family-names': null,
          'credit-name': null,
          'other-name': ['Другое имя', '其他名字', 'alia nomo'],
          email: [],
          'institution-name': [
            '123',
            'Massachusetts Institute of Technology',
            'NASA Education',
            'ORCID',
            'Royal College of Music',
          ],
        },
        {
          'orcid-id': '0000-0003-4153-0078',
          'given-names': 'Другое',
          'family-names': 'имя',
          'credit-name': null,
          'other-name': [
            'other-name-rc2',
            'Margarita Nikolayevna',
            'again',
            'Self added',
            'Other Name',
            'An API Name',
            'An API Name3',
          ],
          email: ['marga@mailinator.com'],
          'institution-name': [
            'Andrew W. Mellon Foundation',
            'ORCID',
            'Opera Charitas',
            'Program 973',
            'Rio Oneida Wataga Victoria and Altona Community Unit School District 208',
            'Universities of M',
            'Universities of Michiganer',
            'University of Michiga',
            'University of Michigan',
            'Yale',
          ],
        },
        {
          'orcid-id': '0000-0002-9578-5044',
          'given-names': 'Michael',
          'family-names': 'Jordan',
          'credit-name': null,
          'other-name': ['MyOtherName1'],
          email: [],
          'institution-name': [
            'Example Organization Name',
            'NASA',
            'University of Wisconsin-Madison',
            'common:name',
            'org name',
            'organization name',
            'this is an organization name',
          ],
        },
        {
          'orcid-id': '0000-0003-1634-5081',
          'given-names': 'Robert',
          'family-names': 'Hearn',
          'credit-name': null,
          'other-name': ['other name'],
          email: [],
          'institution-name': [
            'Aarhus Universitet Institut for Odontologi',
            'Four Star Public Library 4x',
            'James E Wickson Memorial Library4',
            'No name',
            'Once Upon A Time Foundation',
            'Samsung (South Korea)',
            'Three Rivers Regional Library System xxx',
            'Two Hills Community Health Centre',
          ],
        },
        {
          'orcid-id': '0000-0002-6108-9550',
          'given-names': 'Kårlsbeârd',
          'family-names': 'The Gnöme',
          'credit-name': 'Karl Gnöme',
          'other-name': [
            'aaa',
            'www',
            'dreamofaredbird',
            'aaaaaaaa',
            'pelican',
          ],
          email: [],
          'institution-name': [
            'Aberystwyth University',
            'Aberystwyth University Arts Centre',
            'Aberystwyth University Faculty of Arts',
            'Ateliéry Tapisérií sro',
            'Autonomous University of Queretaro',
            'Birmingham City University',
            'Brighton Institute of Modern Music',
            'Brighton and Sussex NHS Library and Knowledge Service',
            'Cairns and District Aboriginal and Torres Strait Islanders Corp for Elders',
            "Centre International de Recherches sur l'Anarchisme",
            'Disney Research',
            'European Road Transport Telematics Implementation Co-Ordination',
            'FAN CLUB',
            'Institut Mines-Télécom',
            'London Early Years Foundation',
            'London School of Economics and Political Science Gender Institute',
            'National Centre for Circus Arts',
            'ORCID',
            'ORG CHEM Group LLC',
            'Ohio State University',
            'Org Energy',
            'Oscars',
            'Panchkula Engineering College',
            'Royal College of Music',
            'Royal Household',
            'Sussex Downs College - Lewes Campus',
            'THE WALT DISNEY COMPANY',
            'Universidad Complutense de Madrid',
            'Universidad San Francisco de Quito',
            'University College London',
            'University of Oxford',
            'Walt Disney Company',
            'Walt Whitman Library',
            'common:name',
            '中航资本国际控股有限公司',
          ],
        },
        {
          'orcid-id': '0000-0002-5224-765X',
          'given-names': 'Clarissa',
          'family-names': 'Dalloway',
          'credit-name': null,
          'other-name': ['Другое имя', '其他名字', 'alia nomo', 'other names'],
          email: ['c.oyler+clarissa@orcid.org'],
          'institution-name': [
            '1984 ehf',
            'Aalborg Kommune Pædagogisk Psykologisk Rådgivning',
            'EIS AFRICA',
            'Hemophilia Foundation of Michigan',
            'Kings College London',
            'Massachusetts Institute of Technology',
            'Miljødirektoratet',
            'Miljødirektoratet Oslo',
            "Ministry of Science and Technology of the People's Republic of China",
            'NASA',
            'NASA Education',
            'ORCID',
            'Program 973',
            'Royal College of Music',
          ],
        },
        {
          'orcid-id': '0000-0002-3176-3292',
          'given-names': 'Ana Patricia',
          'family-names': 'Cardoso',
          'credit-name': 'Ana P Cardoso',
          'other-name': ['Ana Paty', 'V2_test', '﻿Ana', '﻿Paty'],
          email: [],
          'institution-name': [
            'Hospital das Clinicas, Faculdade de Medicina, Universidade de Sao Paulo',
            'ORCID',
            'TestV2',
            'Tyco International AG',
            'Universidade de São Paulo Faculdade de Medicina Hospital das Clínicas',
          ],
        },
        {
          'orcid-id': '0000-0001-9566-0578',
          'given-names': 'Laure',
          'family-names': 'Haak',
          'credit-name': null,
          'other-name': ['Laurel L Haak', 'LL Haak', '@HaakYak'],
          email: [],
          'institution-name': [
            'American Association for the Advancement of Science',
            'Discovery Logic',
            'National Academies',
            'National Institute of Child Health and Human Development',
            'ORCID',
            'Stanford University',
            'Stanford University Medical School',
            'Thomson Reuters Corp Philadelphia',
          ],
        },
        {
          'orcid-id': '0000-0003-1412-9414',
          'given-names': 'Kayley',
          'family-names': 'Dreampaw',
          'credit-name': 'A PineHaven',
          'other-name': ['Pine Haven', 'K Dreampaw'],
          email: [],
          'institution-name': [
            'Awesome University',
            'City of Santa Paula Test',
            'CrossRef UK',
            'DataCite',
            'Kings Colleges',
          ],
        },
        {
          'orcid-id': '0000-0002-2619-0514',
          'given-names': 'Emma',
          'family-names': 'Wodehouse',
          'credit-name': null,
          'other-name': [],
          email: ['emma@orcid.org'],
          'institution-name': [
            '1984 ehf',
            'Center for Seeds and Seedlings',
            'Copperview Elementary School',
            'Hanken School of Economics',
            'Havard UK',
            'Health and Safety Executive',
            'Leibniz Institute for Materials Engineering',
            'Los Alamos National Laboratory',
            'National Institute of Child Health and Human Development',
            'New Leaders Memphis Office',
            'New Schools for New Orleans',
            'Not from the list',
            'ORCID',
            'Program 973',
            'Russian Association of Indigenous Peoples of the North',
            'Sierra Leone Ministry of Education Science and Technology',
            'Transportation Research Board',
            'Uitvoeringsinstituut Werknemersverzekeringen',
            'Yaroslavl State University',
            'home',
          ],
        },
        {
          'orcid-id': '0000-0001-5176-6506',
          'given-names': 'Laura',
          'family-names': 'Paglione',
          'credit-name': 'Laura A D Paglione',
          'other-name': [
            'LAD Paglione',
            'Laura Dorival Paglione',
            'Laura Paglione',
          ],
          email: [],
          'institution-name': [
            'Management Leadership for Tomorrow',
            'Massachusetts Institute of Technology Sloan School of Management',
            'ORCID',
            'Stevens Institute of Technology',
          ],
        },
        {
          'orcid-id': '0000-0002-5196-1587',
          'given-names': 'Albert',
          'family-names': 'Einstein',
          'credit-name': 'J jpg 12',
          'other-name': ['A. Einstein', 'Al Einstein', 'Catalina Oyler'],
          email: [],
          'institution-name': ['ORCID', 'University of Michigan'],
        },
        {
          'orcid-id': '0000-0002-9578-7373',
          'given-names': 'Pedro',
          'family-names': 'Costa',
          'credit-name': 'Pedro M. Costa',
          'other-name': [
            'duplicate name',
            'PEDRO MIGUEL MACHADO DA COSTA',
            'àáâãäåçèéêëìíîðñòôõöö',
            '* ? / \\ | < > , . ( ) [ ] { } ; : ‘ “ ! @ # $ % ^ &',
            'MyOtherName1',
            'Adolph Blaine Charles David Earl Frederick Gerald Hubert Irvin John Kenneth Lloyd Martin Nero',
            'Carl',
            'MyOtherName1',
            'DUPLICATE NAME',
            'duplicate name',
            'Duplicate Name',
          ],
          email: [
            'pedro.hello@mailinator.com',
            'pedro.costa1@mailinator.com',
            'pedro.hello1@mailinator.com',
            'p.costa+b0OiAFfbQK16X21OFXsimJx9Sida4mDsGykClXorHjrqsK6kHg39LqdBYkVLsfVIkmKKLnpuh2mZqownu3NK7R76m6nmcGf1kcmdMVIHlQuoYnHJa9aY2mmXuNdEkjtiyxBO8a3HgBgowcF11nhaJVoWzOu3hKmhiBqVToG11a7CgJ3HHRtdlDhuH1AgEkW0EtbPcxWIwNIfXQKGUppcGHjYlAGwpiNfKXszWBD7tE4aiKIG7bAlewyHWKY99JBf00J3NtOtPCLYEX814swew3Qpyf5d4l3t1rkaKjcdmdHrFUb6UaJMepCXas1IyyRYguYQ7YFC9AlRSuNXsm0f7FT5dJaW21JPT1aPllFsYDjVCIRUVX5aIioLB2L4VIOAbhtroFWxLJR3oenc@orcid.org',
          ],
          'institution-name': [
            'American Association for the Advancement of Science',
            'Example Organization Name',
            'Howard Hughes Medical Institute - Harvard Medical School',
            'Molecular Cardiology and Neuromuscular Institute',
            'NASA',
            'National Science Foundation',
            'ORCID',
            'University of Wisconsin-Madison',
            'common:name',
            'org name',
            'organization name',
            'this is an organization name',
          ],
        },
        {
          'orcid-id': '0000-0002-7361-1027',
          'given-names': 'Independent Test',
          'family-names': 'Record',
          'credit-name': null,
          'other-name': ['Other name'],
          email: ['independent@mailiantor.com'],
          'institution-name': [
            'AARP',
            'AFL-CIO Employees FCU',
            'Massachusetts Institute of Technology',
            'ORCID',
            'Oberlin College',
            'Swarthmore College',
          ],
        },
        {
          'orcid-id': '0000-0002-2787-247X',
          'given-names': 'Ambrose',
          'family-names': 'Ashley',
          'credit-name': null,
          'other-name': [],
          email: ['aa@mailinator.com'],
          'institution-name': ['Bad Org', 'New York Public Library', 'ORCID'],
        },
        {
          'orcid-id': '0000-0002-0790-4366',
          'given-names': 'Update name',
          'family-names': '1114',
          'credit-name': 'Credit Name2!',
          'other-name': ['AKA', 'API 1.2 added'],
          email: [],
          'institution-name': [
            'Uitvoeringsinstituut Werknemersverzekeringen',
            'Wellcome Trust',
          ],
        },
        {
          'orcid-id': '0000-0002-8449-5236',
          'given-names': 'acct3',
          'family-names': null,
          'credit-name': null,
          'other-name': [],
          email: [],
          'institution-name': [
            'Massachusetts Institute of Technology',
            'ORCID',
            'University of Michigan',
          ],
        },
        {
          'orcid-id': '0000-0003-3329-9793',
          'given-names': 'ma test',
          'family-names': '19aug2016',
          'credit-name': null,
          'other-name': ['AKA'],
          email: [],
          'institution-name': ['ORCID', 'Updated name'],
        },
        {
          'orcid-id': '0000-0002-5367-0804',
          'given-names': 'Forrest',
          'family-names': 'Gump',
          'credit-name': null,
          'other-name': [
            'Pedro Machado',
            'Pedro Costa',
            'Pablo Escobar',
            'Pablo Escobar',
            'Myself',
            'Michael Jordan',
          ],
          email: ['p.costa+modaltesting3@orcid.org'],
          'institution-name': [
            'NASA',
            'Something Something',
            'Sport Lisboa e Benfica',
            'common:name',
          ],
        },
      ],
      'num-found': 1157,
    }).pipe(
      map((x) => {
        x['expanded-result'] = x['expanded-result'].map((element) => {
          if (!element['given-names'] && !element['family-names']) {
            element['given-names'] = 'Name is private'
          }
          return element
        })
        return x
      })
    )
  }

  private buildSearchUrl(querryParam: SearchParameters): string {
    const escapedParams: SearchParameters = {}
    Object.keys(querryParam).map((key) => {
      escapedParams[key] = this.escapeReservedChar(querryParam[key])
    })

    const orcidId =
      this.extractOrcidId(escapedParams.orcid) ||
      this.extractOrcidId(escapedParams.searchQuery)

    if (escapedParams && orcidId) {
      // When there is an Orcid id on the `Advance search Orcid iD` or `Quick search input`: only search the orcid ID
      return this.encodeUrlWithPagination(`orcid:${orcidId}`, querryParam)
    } else if (escapedParams && escapedParams.searchQuery) {
      // When there is a `searchQuery` parameter with no Orcid iD:  do a quick search
      return this.encodeUrlWithPagination(
        this.quickSearchEDisMax + escapedParams.searchQuery,
        querryParam
      )
    } else if (escapedParams) {
      // otherwise do an advanced search
      const searchParameters = []
      if (escapedParams.firstName) {
        let searchValue = `given-names:${escapedParams.firstName}`
        if (escapedParams.otherFields === 'true') {
          searchValue += ` OR other-names:${escapedParams.firstName}`
        }
        searchParameters.push(`(${searchValue})`)
      }
      if (escapedParams.lastName) {
        let searchValue = `family-name:${escapedParams.lastName}`
        if (escapedParams.otherFields === 'true') {
          searchValue += ` OR other-names:${escapedParams.lastName}`
        }
        searchParameters.push(`(${searchValue})`)
      }
      if (escapedParams.keyword) {
        searchParameters.push(`keyword:${escapedParams.keyword}`)
      }
      if (escapedParams.institution) {
        // if all chars are numbers, assume it's a ringgold id
        if (escapedParams.institution.match(/^[0-9]*$/)) {
          searchParameters.push(`ringgold-org-id:${escapedParams.institution}`)
        } else if (escapedParams.institution.startsWith('grid.')) {
          searchParameters.push(`grid-org-id:${escapedParams.institution}`)
        } else {
          searchParameters.push(
            `affiliation-org-name:${escapedParams.institution}`
          )
        }
      }
      return this.setEdismaxAndEncodedUrlWithPagination(
        searchParameters.join(' AND '),
        querryParam
      )
    }
  }

  private escapeReservedChar(inputText: any) {
    // escape all reserved chars except double quotes
    // per https://lucene.apache.org/solr/guide/6_6/the-standard-query-parser.html#TheStandardQueryParser-EscapingSpecialCharacters
    const escapedText = inputText.replace(/([!^&*()+=\[\]\\/{}|:?~])/g, '\\$1')
    return escapedText.toLowerCase().trim()
  }

  private extractOrcidId(string: any) {
    const regexResult = ORCID_REGEXP.exec(string)
    if (regexResult) {
      return regexResult[0].toUpperCase()
    }
    return null
  }

  // Remove empty values, trim strings and remove false parameters
  searchParametersAdapter(value: SearchParameters) {
    const trimParameters = {}
    Object.keys(value).forEach((element) => {
      if (typeof value[element] === 'string') {
        if (value[element].trim() && value[element] !== 'false') {
          trimParameters[element] = value[element].trim()
        }
      } else if (value[element]) {
        trimParameters[element] = value[element]
      }
    })
    return trimParameters
  }

  private setEdismaxAndEncodedUrlWithPagination(searchStream, querryParam) {
    const bq = encodeURIComponent(
      `current-institution-affiliation-name:[* TO *]^100.0 past-institution-affiliation-name:[* TO *]^70`
    )
    return (
      `?bq=` +
      bq +
      `&defType=edismax&q=${encodeURIComponent(searchStream)}` +
      this.handlePagination(querryParam)
    )
  }

  private encodeUrlWithPagination(searchStream, querryParam) {
    return (
      `?q=${encodeURIComponent(searchStream)}` +
      this.handlePagination(querryParam)
    )
  }

  private handlePagination(querryParam: SearchParameters): string {
    return `&start=${querryParam.pageIndex * querryParam.pageSize || 0}&rows=${
      querryParam.pageSize || DEFAULT_PAGE_SIZE
    }`
  }
}
