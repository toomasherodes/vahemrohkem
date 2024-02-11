from urllib.request import Request, urlopen
from bs4 import BeautifulSoup
import csv

word_blacklist = ["viin ", "õlu", "pesugeel", "pesupulber", "tualettpaber", "majapidamispaber", "muu", "tampoonid", "hügieenisidemed"]


#req = Request(
#    url='https://toiduained.hind24.ee/', 
#    headers={'User-Agent': 'Mozilla/5.0'}
#)
#webpage_html = urlopen(req).read()
f = open("test.html")
webpage_html = f.read()
soup = BeautifulSoup(webpage_html, "html.parser")
products = soup.find_all('div', class_="stats-row")
with open('./public/prices.csv', 'w', newline='') as csvfile:
    chains = ["Grossi","Maxima", "Prisma", "Selver", "Rimi", "Coop", "Stockmann", "Kaubamaja", "Lidl", "A1000 market"] #järjekord on tähtis!!
    fieldnames = ["Toode"] + chains
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    for product in products:
        product_name = product.find('span').get_text().replace(",", ".").replace("alates", "")
        product_prices=product.find_all('div')[1:]
        product_image_url = product.find('img').get("src").replace("_preview", "")
        csv_entry = {"Toode":product_name}
        for i, price in enumerate(product_prices):
            csv_entry[chains[i]] = price.get_text().replace(",", ".")

        if not any(word in  product_name.lower() for word in word_blacklist):
            writer.writerow(csv_entry)

            print("Downloading image: " + product_image_url)
            image_request = Request(product_image_url, headers={'User-Agent': 'Mozilla/5.0'})

            file_name = product_name.lower()
            remove_characters=[" ", "õ", "ö", "ä", "ü"]
            for character in remove_characters:
                file_name = file_name.replace(character, "")

            with urlopen(image_request) as response:
                with open("./public/pictures/"+file_name+".png", 'wb') as file:
                    file.write(response.read())



