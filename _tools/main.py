import itertools
import asyncio
import random
import html
import os

import async_google_trans_new 
import bs4


g = async_google_trans_new.AsyncTranslator()

languages = [
    'bg',   # Bulgarian
    'hr',   # Croatian
    'cs',   # Czech
    'da',   # Danish
    'nl',   # Dutch
    'en',   # English
    'et',   # Estonian
    'fi',   # Finnish
    'fr',   # French
    'de',   # German
    'el',   # Greek
    'hu',   # Hungarian
    'ga',   # Irish
    'it',   # Italian
    'lv',   # Latvian
    'lt',   # Lithuanian
    'mt',   # Maltese
    'pl',   # Polish
    'pt',   # Portuguese
    'ro',   # Romanian
    'sk',   # Slovak
    'sl',   # Slovenian
    'es',   # Spanish
    'sv',   # Swedish
]

translatable_meta_tags = [
    'title', 
    'description', 
    'og:title',
    'og:description',
    'twitter:title',
    'twitter:description',
]

def find_files():
    """Find all files that need a translation."""
    for path, subdirs, files in os.walk('.'):
        if '\\.' in path:
            continue
        if (
            path.startswith('.\\images') or path.startswith('.\\icons') or
            path.startswith('.\\digital')
        ):
            continue
        
        for lan in languages:
            if path.startswith('.\\' + lan):
                break
        else:
            for name in files:
                file_name = (os.path.join(path, name)).replace('\\', '/')[2:]
                
                if file_name.endswith('.html'):
                    yield file_name

amount_of_files = len([None for _ in find_files()])

def retry_until_succeeds(func):
    """Re-execute the function until it works."""
    async def exec(*args, **kwargs):
        for _ in range(100):
            try:
                await func(*args, **kwargs)
            #except ValueError as e:
            except Exception as e:
                print(f"---> ERROR: " + str(e))
            else:
                break
        else:
            raise e
    return exec

@retry_until_succeeds
async def translate_file(file_name, language):
    """
        Use Google Translate to translate the files
        into the right language.
    """

    print(f"Translating file \"{file_name}\" to language {language}")

    async def translate(sentence):
        for _ in range(50):
            try:
                answer = await g.translate(sentence, language)
            except TypeError as e:
                pass
            else:
                if answer.__class__ is list:
                    answer = answer[0]
                break
            print("Potential failure " + str(random.random()))
            await asyncio.sleep(1)
        else:
            answer = await g.translate(sentence, language)
        
        # print(f"> translated: {sentence} -> {answer[:50]}")

        return bs4.BeautifulSoup(
            html.unescape(answer), 
        'html.parser')

    with open(file_name, 'r', encoding='utf-8') as open_file:
        soup = bs4.BeautifulSoup(open_file, 'html.parser')

        strings = {s.parent : str(s).strip() for s in soup.strings if str(s).strip() != ''}

        for s in list(soup.strings):
            if s is None or s.parent is None:
                continue
            if str(s).strip() == '':
                continue

            # If this string is the only thing inside its parent,
            # just translate it, easy.
            if s == s.parent.string:
                s.replace_with(
                    await translate(str(s))
                )
            
            # Otherwise, take the entire content, and translate it altogether - if possible.
            else:
                translation = await translate(str(''.join([str(s) for s in s.parent.contents])))

                p = s.parent
                p.clear()
                p.append(translation)

        for elem in soup.head:
            if elem.name != 'meta':
                continue
        
            keyword = 'name'
            try:
                elem[keyword]
            except KeyError:
                keyword = 'property'
                try:
                    elem[keyword]
                except KeyError:
                    continue

            if elem[keyword] in translatable_meta_tags:
                elem['content'] = await translate(elem['content'])

    path = "/".join(f"{language}/{file_name}".split('/')[:-1])
    if not os.path.exists(path):
        os.makedirs(path)

    with open(f"{language}/{file_name}", 'w', encoding='utf-8') as write_file:
        write_file.write(str(soup))

    print(f"> File \"{language}/{file_name}\" translated!")


async def translate_all():
    async def translate_part(min, max):
        await asyncio.sleep(random.random()*5)
        for f, lan in itertools.product(find_files(), languages[min:max]):
            if not os.path.exists(lan+'/'+f):
                await translate_file(f, lan)
                await asyncio.sleep(2)
    
    await asyncio.gather(
        translate_part(None, 6),
        translate_part(6, 12),
        translate_part(12, 18),
        translate_part(18, None),

        # translate_part(None, None)
    )

loop = asyncio.get_event_loop() 
loop.run_until_complete(translate_all())
