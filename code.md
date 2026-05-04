import { useState, useEffect, useRef, createContext, useContext } from "react";

const CHURCH_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAACUCAYAAAD4UUeAAAAAtGVYSWZJSSoACAAAAAYAEgEDAAEAAAABAAAAGgEFAAEAAABWAAAAGwEFAAEAAABeAAAAKAEDAAEAAAACAAAAEwIDAAEAAAABAAAAaYcEAAEAAABmAAAAAAAAADhjAADoAwAAOGMAAOgDAAAGAACQBwAEAAAAMDIxMAGRBwAEAAAAAQIDAACgBwAEAAAAMDEwMAGgAwABAAAA//8AAAKgBAABAAAA3AAAAAOgBAABAAAAlAAAAAAAAABGv70LAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAgAElEQVR4nOy9CZgU1dU+fqqHxX2J0RhN1LjELYmJYkxcEqMxxqhxCcjODLugoIAKKNvA7PvAsO+ggaCICyCKEHYGhoGZYfZep/e1upau6q6qXv7nVncPzUiM+b7/80O/1Hme+1R39e1bt26d95733HvuLQBNNNFEE0000UQTTTTRRBNNNNFEE0000UQTTTTRRBNNNNFEE0000UQTTTTRRBNNNNFEE0000UQTTTTRRBNNNNFEE0000UQTTTTRRBNNNNFEE0000UQTTTTRRBNNNNFEE0000UQTTTTRRBNNNNFEE000OS8ybd0amLpmHaZ3YerqDee7Oppo8n9Thi8ogsfGvQIz332fgvvvhl+PngRDCsth0qq157tqmmjyf0sm1SCorrsRSncfhGlr34M7Bg7o/YfJ03sPQBC+lFcIb2zcdL6rqIkm/3cku7Aacrdtg2nv/h3GVC7qN7ayZsnY6sUT/jhnQdZd06bD5FXrz3cVNdHk/4aMKVsB46qWUMNLqmDg/OIbRxZVHhhVUpUYXV6947nc/Mufzl0AoyprYPIazZ/TRJP/tUxdvRGmFlTBzNJFkF1Unp9TVBHLLihPDM8vXTZ+/kIYX7CIemX5yvNdTU00+e7LrM3bAIFF9Z+VC0MWFP8KwWbJKaxIkDRsQemeAXPyf9B/Vh5MWLiCOt911UST77TkbtkE/WcVwmtLaqg6rgkGzSssT4FNIcfswvLgsPzSPw3NLwU86mas33y+q6yJJt9dmfvuuzB5ySrdy5WLYcCsBQ8gjbSlABclaWRxZWJkafXUmWvfhSlLV1GTV64731XWRJPvpkytWQUvly9Ofsm6GcaV1yzKAFtM/VxUISPghoypqIFxlUt00zdoUwOaaPI/kucnz4JXF6+kXkkC7/6RRZWObsAVVcSGzC2UB8/J3zW4oPTagUVlMGX1Bs2H00ST/6nMWLUenpsyE34zeOzFw+aXbFZ9toLyKAIvPjS3ONp/+lzroNzCl4bOLYBh84opuPGO811lTTT57sljE/PhtSWrqREFZTA0r/yGwXML14zIK+NS1i02Ir8s9uKbc9wDZuYW5JRXXjTzw3/AkNxCmPPulvNddU00+W7JjHWbICe/HKau3QytiQQMmL2gKAW0uOq3IZUcvqA0MfCdvFqklLcMnV8KmKjSffXnu+qaaPLdkxkrVqtzbkPmF8KLM+c+ghTSnTlQgt/jQ+cVKUPnF096pWIhjCmppnIKy893tTXR5LspE6oXQ+Xuo/DkmAk6BNKKjDk3YuGi2fnliWELSnY+O23m5U+/OQsGzsmnxi9Zdb6rrYkm3z2p2LoVxpRW6caUVkBOcfmDCLCzrNuw+SXxIXOL7KOKq//4avUyGFlQSc1+T5vo1kST/5FMXr4GXpiXBy8tKOqN1m35WXNuBRXxwXMKo4Nm58+47ekRcNl9T8DrS1af7yprosl3U2as3wSj0R8bWVQB2YXlv+lh3aIj8koTQ+eX7BmcW/KjkUXVgIl6pXoJTKqogRlLV8OMZavhrZVr4a01G+HNlRtg+lqyGnwDTMP0xur1+HktzHxvDczQJsY1+W+XtzauB/TLYHTxQuqdmm0IuLLKngMlQ+YWioPnFb3e/51cGDKvSDd0XingbzCkqByGFVfAsJJKGF5YBiPyS2FEXgkMy8Ujljl8fikMx8/DF5RhWohlV8KrS1bCtNXa2jlN/g/K9LXvwdzN27q/z5y6Vz1OXboUpiGFnFSzghq+oIQanl+SNTSvEIbmFt2DFk6fCbgReWUJ9N/cg3NL/zBkXhnM3LgF7n5sNNz+0jC4oqIAXlxYBS9VVcHA4iIYnJsHg+bMhxen58GQd/Dz2wUwcEYhPDclF686Fj5sOozUdTX16tKV1JTl62DWpg/OU8toosn/z/L6srWQnVcKY8oWwpSV66gpy9bqxlfW6CYvXaWbuvJd3Z1/+gMCYxYMmoXgmFcAYxfWQHZ++fwe8ZLkmBiRX2YYPLfw9ucmFWcNyS2+eMD0gj4D5xb0fnZ+Qe9BxaUXDC4pu2hIQdGFQ+cXXjg0t+CiQXOKLho6t/DiIXOKLx4yu/jigXMKL/jr1JJeD4+dppu7dRtMWr4K/vrWHBhbVQNzP9j2729GE02+bTJ1xbswe927MLlmJUxatBrGl9dQ6JfBBPSthhPqh+AblldMRiDhtWXvwl8mTeo74O15Vw6em3/TkNyiu4bnlU5G6+ZMR5SMLKyMp6YDSEhXCC3dNgTkRgTfh/h5DR5XjCgoXY3/2Ybpc6Siu7ILyj7H81+gz7cb6eWXasor/RLLfn94QemynJLKgtHlC4ePq665928z5/cejz7gTG0vFE2+SzJ11SaYUFkDL81aAGh9qAlVS6inp8yDUUVVaN2q0b9aqBuSX/pD9NMeHza/eHROYdmUkcUVCxAc6xEcn2bnl9XhZ0tOYbmSBhsBGomZTAEunlwZUJlILzwd2f25PJFTkE4V3b+redU8lWrekanjqJKq6OjS6tDosmoTWt7BZJXB+Oql1GwtLEyTb7u8WrUCcgoqISe/DLILK9AnWg9/m5ELry5aDs+/mX/J8PyyfgimWaNKq98fWVJVS6JGMCkqSIoywHEmxdNgUwF35lw8FUMZHb6gVCEJLZ1Cyho4K08ZNDuZBr69QBmWW6yeRwuo5kPrRpJMjhn/jRHwjSlfWDa2rAbGltZQExevgHlbNGqpybdQ3lQt2gq0aIUweclq6vlpM2Hw/GLYbrHDC9Pn3oUKPwrTBwgSV7d1OhtUxC9TgUGi/0lKAS2Wo1q1ykzrFk37c0PmFcYHzcpPIMgSQ3OLyGrvBIk8UVNB8pjy9xKDZhckSN50GjKngMRf4vl8dcUBWrkvcoorHxxTuggQdNQMjVZq8m2ViVVr4YW3FsBtT+XAm2s3w4sz5104aF7B79EPq0Blbs2wTomeoMlMGWDrpo4q/TsDtlgmWPF8GC0ljXTQiXSwC0FjR4roRDpqHr6gxJBOI/JKDKOKq+yYx4V5HKNKK09lF5RuxXyfonVdP6qsanxOaeWPJlQugmnLV8PoTdomspp8i2Vs2XJYvvsjgCcmwoi88geRNr6PgPBkgCOWAbA4ifBHy9UTdOeik/GUb5ZeGUA+t4woKFszoqC0aERh6cvZxWVP55RW9BuzsOaWkXjE848MnpP34N9mzHm4/8w5j/d/Z85TL83OfWpoXtFj2UVlvx00L/8eBNqPBrzzziWD5uVe9sLMmRe8tXYjjCypgInody7evut8N6cmmny9TF2xnhpRUA7D5pf+AAFRm+GPnQFVUWUsA3g9aWViZHGVmF1QcWJ4XumXaOXCZ0BXmWnZup6fOfexlwuXwMtV/4BJVSthwsKlMGHJUpi6dDn86Z23+mQXl1w6cPbci4cXF1w6vKjg+8OKCq8fUVR6w6D8gu89/vIrF9QmwjA8vxAGzHkHae98eGnubHhtySpqbPlCavI6LQ5Tk2+5TF+3BcaVVVGjC8sAATM2FckfyzhmWrLUiGGFPLK4ogl9rp3D8koXD84tejOnqPrPQ+ZX/GjI3II/5RRUBLqnApJ0kqzqTgyZX1xYJ7AQTiTgb2/nUuNLF1PjKmqoiTXLqbfWbKDWflGn1umEmIBBy2fAoLI5MKR4AWQXFsL92QNgycb3qNcWLqKmrFxDTV2xCqatWke9sXItTMLP85atOc8tqYkm30DeXPsujK1eAmiJLkb/aZdqrQor5Z6WjAAGAebLLqzYn11UOWVoftl1A+dVXnDfqMlZq/fvQdAughH5ZTB8fsm0jP+esW5FFY4RhWWP/OWNmfD8zDm64fnF8OrSFfD6ytUweWkyaHnymtWAYILxZdUwurQcBqEFGzx/AQzLzYfBuQvgjtkF8HyVFsKlyXdUpqxYR4BGkQlstD4/R9rYdhZVLKqMjCypMo4oLP8wp7hq8vCCskcHzM3/YU5xDeA5GJRbATcOGAUvo4VsTyjwh5enXI7+3+4MOpoeYEmMLKn8+6/HTOyTQOvWf84CmLnh39O/6evXY4ewDt7c+C5Mf3cTrFilrZPT5Dssk5ashmELiqkhuSRmsfA59L2S+4wUVLSOLK7cOKKwYlxOWdVPBxWUXvwmWp9h6Of1n5MHSB+pUSXV1Cs15P+l0H/WfLRYJehblT2B/w9mDLSkJrwrwjklFWOy80vhpdkLqCmr1p3vW9dEk//38mr1ChieW0xhgmHzip4ekVd6Yvj80tIB0+ffM3ox+nWlC2FMZQ0MLCiF15YupxCAuklLVlFkn5KJKzeqZQycXQgtCR9+uoeauHB5WaZ1Q6ClrFtVY05J+Q3jF9XA+KrF1FurN57fG9dEk7QQyvXVFFePcfUYT51T/tfXKlz/D/jb6+/AsFmFMKls2WWj8ypuv+0Pz/V5bOIk9RovTp9LjS6rpl5dtoaasGgNTF1/9mTymys3w/C8Uupvb88DBNfNSE9bz0UnMdUMrCinBhUWw8voLxKJy8I3aIsIpjAk4pFvdD+JuPQN8ojf4Lqiek01Sfw588gCeyb/v8iTvF44eQ+Jb3YPX1uvb3B/mvwHkgZYLEZSPHU8x/c4yRfFB6Co+f/H14tH1f9bbK7khqs/+w35Tm3+bJdu58FaKn/DRthy4OC//P/kmjXw1tqNZGkMCQXrT3y+lGUjo5Pp+ElpVHHlCy9XLYGx5TW6SSWVwLEM0D57UrEV7l+0hQS03wE+lxlCQde/VdhEQgYu4Mbyzq38pDyi+DLrVUGXSPyrfAKEWBcwXiu4LXpwmjshJp7JKwo8yCIHbhuplw8S0QSE/G4QaReIXl93PgkBmVBEYLEcFu9VEelkB3KOzkOtjwrwc9dLfU5xGSJsAI8xSKAOqPkT/77z0OQcEiMgI2CLxyEei+qwgb8mKTqSJy5FdNGwQKkWL/afWbtEglUfYpjnKFLmujUbgXaiUosi6E83g0lvgLtufYCAWpcE9ldBPXvtJpiSopWvb91BIeCWdftuRRmDJYUVJ7Lzyn4yAn29Jye9SUVlCZwOq87j6NIFPDYdUcrMToNYbnJNkWcg6HfpWExcwIP1UKgkaL56r0SRIyGGCrhtOpZ2UXZL01fKkyM8sAEsz+fQcX4nlVmOmofUA1NECFJ80KML0R5d0GPXOSwGnd1iApYJABNkoKOtFdx2K2U3G3SG1mb1mfmdVp21s4VqOXBALY9naTB0tILX3kUxfqcuxPh0IuvX4f1QXodVBU+yXnIShEoEJKx/hKepONYzDaR03WNKGIJely7odlAh2geMzw+0x6ET1M4jptZBk/9AEokYxKLYsNGY+llV8q9NmAcVFwGXpppU0lopX0s1EzEpmTB/FP9He70q8DZt/Mf3aw8d/uWRg4f7naqrv6/19Ok7K4pr+iSiCtTW1eJ/Il8pe+aGTWixyJzYOhLlcd2okqoTGXQyOX9XVJkYXVJd+PaXO+GZ+fnw3vZdYOkyg8nUCQ6rCbxOM9ABJ5g76vEa4VRbKGjZ3OD3ecDvtgHttqKyOVXlfAzuxI4polqrZN70fxIQ8NjB67CAzdIBzQ0HwW5tBoHzoKVhgKU9wDBevF8sz2mBIJaJwFSvSayK06qH2gO74ciezxBMRgJMEIJetExO/M0IFmMndkIdcLy5HhqbG8BqNkAXfm9vOqV2dl6bCYwtjWA+3QS1Wz8Fh8MMrS0N4LF3ITgcwNFoATk/MH4XWkZTMtktcPx4rdqZhYIeiPBBzOMDS/txiEVoFXQsjXX2ubA9PGjpbRBwWoGWefzsggDeA3ZY+NmpAe4/kXiSRlKxWAzi8fjNmOYjIPIwLUgdz05x9Tg/oUhvRMOh52OJ+OXRGIJNRPBJwrktAOlRCf1E5VMiIkUeEFFSr9P5AFq5mQLL7Ap4PBa/2+NAENr4IN0ak6QNITbYv/l0U98A0iIu6Kfisthd/vxtO8m8m45spTB8QclwBJjYY3QyMbK40jeyuOovg+cWQt6qdTprlwU69Z3XtLe1jLGY2ke5bPrBqODXW/SNqq+j1jUhU163HQHnutrr6hrhd1mG0h5bTtDvfIDUOZwIZwBNBtHnhi2mZvC5bU84uwzjreb2hxtOHdCdPLkPDJ2NCDI7RaOi0wH3D/1uywi/3Tg84DQ977Z2fC/gMACNlNWOIG1prANDS2OWx2l6hPHbh3N+xyC/wzzCZuoYaNF3XGTqaINmgx7aOtv7Wgwdzxrbmic0n6y7KSEpFzuMHSMMp08+3V57oteKKXmg72yD9tamy5wWw/MBtyWHCziHIKgG0V7H3zw241VuBLHDrFefgchHIEQ7r4pwgQEi633W0n6sN+M1I+Bd2OHYEXBuTJ4rPXbLYAT2iz6fJyvg9tyMnctIj8P4cyeClw140WJrG+d+IyE9ZNp3k3luTlSKJL5RioiJaFhkkKLtQ0s3KBFReiMIU3TlDLdXv4c5kJD/y4pMyRIHUSXyE0UUKmVRsGHCssJfSUpYTOBvQjjELmIDtssZ7O1FpDxEydd88SWMLa6GoYWlkHjzM0A/bWlOj/0myffRZdWfjy9fdOn9U6ZBCDsVco/2LssrIs9GwzyD7IlVonL4EN7G7ak2oNJtEfR53oiEeFkSQzEpxEexLq1SiP1VatCISkRDoEgCxaJ1QAt2b1hg26QQl+Boz9I1y+b3WVj2JtjMbVS6TIGnJ0gClifwcUwRSQh9iJ3HpZGwiL8xOgJKJuC+JMTR+0gerJskssGEx2Fr1re1XLP7853QeboRWk7W/VpggnrslBIWg75/XJH/QO7D3WXaVLVgTl9yLX1rK6aWJzja78OysJo8jynGBnw2pKe/spmNwNP+LHIvfND3J1kM1eEzlPAoSDyTKyPFJC5GROR1UjiER+7hSIgL43VaI17vZXjt6SIXTIhMYJyI9JW4BedRhb9bolJBgSP+A/HJthFFxyRhUv5NiqbyEvChFoVzE2zw4gT6PsSaqWUT+ohWLUKce6LIZOBF5J6JydIJtHSJ1P+jqRTLSNHUNQjoEgiOMlSg3ts/2tRt4aauWEuNr1gE4ypq7hhV3D1hnrksJzaqtHr2i/Pmwd9376beW1kD4yeOzfK5ne9jJ4OsWN4sC6EWUr7F1JabBlzbiaPQcnx/L5Ghd0WlsIQZP4xJETfpYPigd0wakDaraiF05DMq41xSV8yXQEUsSOfxOi3U4X27oLH+6MWhoP+TeFSWUck3YYdiwvzYf/jvlZGWR+VIFrkvnvH/PKbI/mhE6AgxgWK/x11mMxlHHtr3OQESZTOb0BqaR2JHoLadx2EfxnPcfHJdLD87dV1d66kGMLS2/ox2u0rCHOuKK1IIAbcYWcR4k8H4vY+RWvtcDrRgrh9i3evwev6YJG7EDjQWkyN7Qwz6ik313R1xmA/OJJ0stpWXdtr/gM9uc4TnFNrR9WQQqSbx68+nDn9nJEF8tniUSsgRiAuhm/DBNScBFI5iin9dwnzxFDhUYODDikRFfoQiCITTU2RgJM77QUL/QfXzZAWUEDMUQe1NgS0TaJmf49Fwd/lKEpQCix3C48nRsqguf+MWyC4tp7IrK2BM+aLxSB2jqbhJ1Xcja9nIUpvx1YvvnbBkGaz57HMdce6xx78Yr31KFnl0Pzp/xdK+FaR8l8P4ereFQ7+RDdLXxWWpU+aZZnt7/W0ix2zHthGlMN8vnQ8tD2XSt4PZqL9Z5NjTahugUiKohqo+biyqQ4tHKSJaQpH/PlqPDrSQnQ5j861Y3ibMH0HAPR6TZfSZIllKKAQ+p+0NUg6Cb6ocjaDv6FX9owP7dnYrP1qXCpIHgSS7bdbXRZ77UmDoiM/R1c9rM6OfZdOFgjRFe4iPKF2J19dHQmxL0Gm5jPX7INOS88HAKPV6Ef5tj7WrH1pdNOfhHQl8VrzPS7U31YGls+kigQl8QfLh7w6Xzfo2Hk1YbqOp+dTVts4WAjjttV7fRIjFkTiWirBBEAL+bFkQhJTViaUUvmeKZf6WAbyUNeJ2h2jL1SHaCGHOTUk+G8gRSR0ZjDCB/ooQolPlKxnlxdOW8l9cW7WkfNC/ds8/P7lg2dpiWP3pdmpCdQ1gumx0SdWOc829oXXbNaFm6RXDi8tg+6HDWR67A1pPn35KDotcmGU6Ay7bQrQUvrDAnfZ4rTd4vDYyuqfjg0FiRYagUsUUtArmloafIgU1I6gMPBO4NmmJAtQZpfVPIBaHDfjRioTQzRReRLoM+DkL24eKIJA8TsczCPSYLPBr9Y0nbkaftR0tjklg/T8kw/fYoaiWEqnru2GeTTitphnHD++7W+KDV5HnJARp3Z4dO2H/57uvRxAeQzAjcQgqjfX1G9FCOpEB1J2uPXRd09EDgP5cNy0OuBz9seOIIu3buHPzxotUy2zo1B34cid8uvW93hztew/riFZX+WVECL2EdU4EPc5VaVBKWHeRZX+MTKCT0HzMY7GaDRuxjkh5mfXdg2hqRxg73+r87ZaUtQBsTJ0c4rEXFuanKR7Sp55AS/QARrwH6BAUYewBWTdPu+/laBcIjE8XC4tUTAhBXOTuRsvWcg6wqWUhrenEh9iAD/wswJ8pW0wE/d7TRkPbtU67GTbu/FwN5ZpQteTBUSVV3S9VTFu4kcVV6L8temP8oqUwsXoxmbrQEcvldTrnEXAgKBRCJVHROZ71D00rGFoPncgygL5OeZjn0IowXyJIPkwqG1++cePSLLXtEgrltHeC22G6GC3XgVAwEHDbbXoEpYS+3zOM30vK0CXQZ8VOBv1BbykpDy3PSCEYvA+vHWd8no+3bVp70TtvvIy/u9Df67wJWcIJUi+ODoTZgPeUub3ldokLotIHs4Je9BX9vp8jAAJI+bA9/Er98eMGgQ3GJVEoU+9BjlKkrDTgaK9nIdYPGYswWj0Xj+kQnJQc5sk0xiV4/6exwzV7rdZfRERxOWlnBGlOOm9MFoH2eUcSX1pgWdKpOJxWSy15NgIdmNBtLeP/+yCI/wohvZIQCIBI01dgI24/41OFuwGBD/sEWoRpqJpTBI5bgIpzLKmsSdCkBjjSVklCpXkEE2DKCjmMIDHBXlFRWJPhr3WXjSBz8Qw9McT4bqU9thuIQiIgnGnQZQKO8fv0JqPhOibgg53H6nTZeSXwctWSGekJ7h4run1IM58YjnmKN29V/Ysps+f2wvslfhvxs45g/azooynRmPwCGSQQBS7rwJ7PoLHu8BWyKH4hEwoV4mVyr6jU+4LBwI1h9EfV+Tik4REEQtDr7o9UM2IzGw7RHvdpzM+5zPpHPUjtaI8j64td78GJY3sujMuRXejzhB1G4xN8AP0hpNRooV5LKmwsi0cfF9Nf0Oqx6EO50cdtkcTQe2Zjx4UBn7ubArJ+78txRZbRlzvABgLBoM8XRwAqXod9AqGLPB3QKZEwdKF/1tzalJWIyjslfGiMx/F7xmPH3706vC8KLRWwDP0ofhYjHL/Z3WW9ORziWxGcngjP3qKOKMdjWUQ/sBOpRgoc6zIZrHhNDjsDNOMRF7bjT/G5kHwU+sPnW5W//ZKIxrFHjOgiHAOYfo2N7ehB6dQj+gfTMsO8OG/gNqQahzKtIQJDzYvKF0O68yixnHiuF/oZEGaYPxBnOwNwKtjQqnlor/OvhJIwfidY2k8nR0pFoVBJgjiaCTiWDnRaTMbr0g+39KM9l4yrqNnaTSdT695SS3n25+SVXTtkdj7sravXcYwfTIb2u5HKmWOKZAn4zbfKAlcTlSS8ZEIdCEEl7OW2mADTQ9gRMHjhevRd1hOahb5OKVEuQv2CHjfs/ewTaDl5vC9aw81qp8SxhE4idQva7Kb2XzvMHUjnrFlemwG8dkM/cq/YLgfd5s5LscP6gIxAIhN4lMP7TsSUXqqPG5Vfj0lYFuNVB3CEENfb0n5SHeUlsjDvDR1axU0xJRIRBO5VbCd9ckRX7PS57D/jaR9gvdFK+yna7QS/y34v0lgXAmKvta3lSnt7C4KHIWCjIkh5OSY4C6ky6cjGRcTIHViWxHg9R47u3v3947t3q9fE+7oIKekepK12n9O6Bu+RIfeLncUh1uP+XgyZkUYlv6GogEtEdXHCwaPyYOzt4xlWJZZykhls9HtR8Ug0gi4NOkUQ5/awQirgsNeLIMgexgeLZSq9sUwCvDd6gE0tW2DpeYl4msr5kX5JWWSwAa3rmymrmaaeSQtHBw40NTddRa4/uLAcXl+59iH036w95t6iqfm38hcKi+DhyW9ARC1XgbgSeQItCHbe0g4u4LkHFfaEHBGkcJh9OhlxofRSoyai8ouEhkW4QBHWawSChQCuDCllcjAorpCIG0LzHsLyvEiVAxLPqqOdkRDbYDO334aJTGH0UstVhBflcCiBAF8ksIE7FEm0hUPckbaGYz88efhL+GDrNjhx/NhlIs99hG0gSKz36T/+/NosU9vJCxKxZBRMMpwqipZSOoHldMk8/Wdsk04EAuJR+jSRiFBLl80mHSgZwidRMWSgJofcL95LicRzqusQlUTyPHRkKigmhVdiB5RoOnE8B+lpPqk/Wsh56ZFOck3G634E7zuElPzjEMdmYx5WfTZIYT//4N0sQh1IW2jyDSQRi0H74ePQcfhYb6Q7q9JWJVPJUdnqkYZcbzV1IkVKhjcBPE6iE6ZnUMr4GavFelCZ7xXZAOwcvQpEf+B7+HC29wAcUYJghKd/rQgcYG+v87ucVFtTI7Q1Nl6OSvBJD/oZjZJBE5ZRleFgS7vuwdenwIRFS6eMQl8tp4AArTJzoSmTXVj+3OjSapii+m/JsC0E83xSjsjQFinEmZG2oX6Lm1taT1z62PAfq3kmvDqyN9LNVUSpQgHPX1ABJxDfi0OfDhWWAE6lp3/6y9PYFrFyki/M+qYa21qewXwRvK+DzY21V7U2H1eB8penfo9gj1Yrar5gC17XiHkkxu8eJoWSvpkfLSb6Wrdgx2ZBhTXlPbQAACAASURBVJZFjv4iLgl7/C5bwYcb1mSpVJIOgrFT/ye0ThFF4Lfomxtu4RmG5EcsxAuT95cAq8Wceb+Lye+eLvMYWRDQZ+OpgNMOCgGcIpEAhFXEn6W97iY8hrFeLdix/JT2kMiRWC8yOhpigjkSmYLg6Dy/z/+CJAhhMjCEvu2zqYESnea/fUMhvTXrdgPn8VwR4dgTPZWcfMdGrfjRrReqDxF9FPWhOk+04wOLVZzLz5JFfp/IuH4QChpAoBngA4F78IFlUtUUkNk6j9N8k9tuAI72UFwAaRCWz/jcN6Di6XtaRFSIGM8En04/3LwtH10xtnzRh6m9T3qMTlY1jKtcdN3oqoWwZudnupPtzWDzua7ieXY3oU1Ie3ksj+GC/g98PuudATWIOapT0I9zuWzXcAzdKImCnQsGrkGr8jrx5fDaeQgotH7RrHgylO16RYq0oOUyyGH+mraW08+jhYrHFGUlaSNiRU7VHweLyXAd/vdgTJHDmJ9Dy98khUOjnT5fn25LQmg6yz4ZlSUaO4EQsoIwAXIsEqlQnxMygLDIQ5D2T0kO5LDTGjob+6KVPEX+EwmFfpcevPB63JSJTGqH+Gux7vvwAbbhM7glRgISEuhrEQYhiVTQ7wGa9g0PC5wRf2OwYz2CluxJ5KoQlSK6ca+/DROmzca6xRfiNcKhgO8Fl93xW+I+Iug77BbTPU6LEdCfVsvU5N8IsW7E2VUHN0L8g6jUPiU5l5b236LEd0HLl016OnzIOuxZIcoGIRGRLlbE0IEeAFXI3BpSlvxYLKpO5CJ1g1hYfCnaPbeWnLOLJvOVds8rsX4yH0iletRnyYhYukwymkiUj6NpU0tr672ECv3y1Tdg+oZNPx1TtlCf/ZXpgEqy9m3ZmJqlvcYuWgpFf98CUaRXsYTSG3X+TgTbfdiJ/BLBdPfBQ3uvIPGFRGEC6P/Ekf5FY5FeUSXyM4EN3n3y+GGkhPFrEAD3S5Lww3DSwqV9WTIR/UuBo2/vaDxCWc2GK8Mh/j4896OorIDAcuC1uIB2e/oirbsLz/8qGov+wqxvv16NBGlrI1YN0kudgkHmGgTyL7Euv8R2+yXe+y9pn++qRCqgPHnN6LUI8PsQLFcnB1Git+NvP8fPveRoDGRZhnAoBIzHg1TQi/cr3YG/3V762jQ1aiTebfkk6Gg9BXpTZ1+ODdyCrOXnji7zNennYe2yg8PhAqvVnoVl4O+Je8Jh6SKPxdUHy7gb2/J2l6urj91hwjI16/aNJMnhI1QsEoZwkJ6BtK9nlAcZobMGve4Haa+LDEdTSEuyZD4EIsP+WRFFOsNqpWkii0zxedV/SEQpTm/spYRCi3rkixH/CCnnGAGBhvRJZzEYuwdkvC73EuXsOTn0USL4U2zLY0MG9rFhnrsmTYfxFYtyRpVU8Wn/bUR+WSw7vzyONFIcW7X4hZcXLYNxlYupvk89B2in4dErrlCVO8yzkPITYdcXn5IlJqr1drmtICsCOA3tJNoDnBZD98gg8UNlWQQxJIBEwrA4lhKQDqI5UwN6SSC2vqMVlZ1X78HvC3Tfz4kvtoLM0cT/UpUeAZec30LwPj1WXYoEP8DnQah1Mmg8pj4b7GTA7/GqgcU/huswzwXJFQfhEAS6h/2j3YCNSApIEUkFHOsjQc8+QLCovzXs3fcVwO3fsx1ONjUAS5bbYDk2i0nN++n7O8Hr9kJXlw0sFivebzgZbxlG629yqWUg4KCLBFRbDV8bqK5JhhCHGOkExaHSo9O/Vjl7fkydxEanervVYOpD/DYEZFaMxR4+KFwph0I7vmLdiG/Es5+hslymlq8qgnIplnEwI28SyGLIRnsdD5H5Ii7oo1w2s/pQ8ypWokJFshOytCguS1WYtwap3WKs6wqkcH9JxzBOLC/rPbqk6u+ZdJJsWU52SR5VWt0xrmbJ3ZhInKW6tCeCymx3mlXl2L17+4U/vuUuSubd4HF2Zfg7CbSuASroc6qfN61Zqk4SL1paCmhxdGpbBYMQQKvktllVYBzau+vCQ3t2XRhDBTYaOgEpJfozZ2IxiczLfijr3YKZ6iik6fRxNQDb0NQEn+/bBoeOf6Hme+aJe7NmDXwm6/383F4r58zpFbB2ESpH2YxGqnb/IXjp0f66tydNzXI7ebKkR8cG/CnAkeVCcSqeAlOie6FwesVHnEol9Xz3s+9elqNOWlPdiaxxk1JxpKygptT/dd1r4NROKEalV26QMjT5N0KiS4j/JvgDZFDjpwimxp7+mzrixrP56OuAGPSBjHRS8gWviwniqii6GEqPKBAEERvi0LolHWl1/iYaCv0WrYMro+xkmFZE/MxLm3X8P/n0Q+xW0I+3HqBe6v+cbsobr2RNfOX1XpOnTOp13V339AK4jNp69Dg1cE4uDJ+ff9OoksqGzOiSEXllyWDl8oWbRy9aeMmYZYvgqekz1d5cDNFgNHdeHmIDz/NB+l2s44ww475GwfMi61PrEBVDVAjpMuN33cHTvlmM17UpIrBPtRgae+2MHVeX1qBlA6/TBQGP+1L0654JBQMbuYBvo8gH7/fabBBwuSiBpSkGQSmyQRKRMhNTWUKRyrF9xgl88AqVQnMctX79Dtj+yYEsl802GBsHOxWlIhGVF0aFUK7IspdjAlG1Pgx5XhMjHFduON18c/upBjC2tFJR4d+vVtfkWyRktC3k9wOmvyJ1DPWYfyORGDLv964Tg4GccDAwThY4QjvTflt6VDKaBif6PGWHjHW6oq2L0EoJOgLQCMdMIxEVmfnVoWcmsCgNMr/QSdUd+iTL1H40i3Ubspxt9Vky7chytTZlHfliR1ZNTXUvg9GijgyOKq6iyGT3iLziATmF5Wz2GTqJgCuNjSyuTIypXDRzTHk1DM4toNzBADz8zO9gz57P+yDQqrBe0URUkbETQAyE35AiAijEevE0RdZ5BTy2n4kccyqmSIgTJSEJnFPf3vCoSX+aUEddSX45fL7z8z5IB4swTySmRATij6IVbrAaOm9wWs0kpjArZWF+j5QzHI/HoiRFFUn22MyvqPRMEHR6vR70esNlbCBwLKHIeDrOxWMxCet2UhKYa8hqi0N7j0JLQ8sdsih2oc9rbD9Zf5u+8RQEPS7qP13wq8l5lKRVUdSwnWhYfC1tgdTRxoygZARHBFOYHJWwkBnn2O23kfMRjl3J+fyXB70OtIQciR2k0M9DH1FclaaqqQETEhQtoNV8PhqJgM/tvZwLBqahH7cmEgouF7ngijBLrxIZejUf8K9DX2Sjw2bddqqxYdKkOblZC7Z/QWWXLoTRpVVvp7YvVyNMsgvK0X8rI5PdAfTh/ornICevlErOJSUgLAoDyPB3NCK8jz7m3DgqeCwqr0yP7FUXzYUDu7dfIrL0P1D5xXDIPwEB8AlavERrU91ofWsjWjZbLwH9vyAduDsihGgEbjvH+IeHee4wtk+t3WK802nvUssb1q8fCSMrjMejUWzEt5CbFyM2Ew5TRwW5ZkyWsghgeJa+CUHrVMKhOvTNHsHf7kSQ3+zqbND5vUGds8uO9NUxUOS4REwOr+sOPtCG4b9bQsKSvBYz+G3W76F1+/QswJ0dJ9kzoDgazQheRivml0JskRAMXCYEaTIAQkV5llKYAChs8Bb0DTOnGtIDKyZJ4G8k8Yo8Td+KCmvrOUiiJhI6JqqTugm9vv3NNOXMnpd32eiS6s0pwJ01HYBgqx1XufCHLy+qga2HDlNwKVrF13J6o4KvR0sUExnPY23NDTm0153gaF+hGizMsVkiGbxhfD/DewlGw/y+fXs++gF2PLvDPCu3NNb/tb2lEf07MomtWq4Ho3IEASB+hjT1YpPReL/bYf9JV3sLcH4PxXptEI8wF2PbHECAB5WQ70eKJI4kHZPNkLwPBGMWie5xdZkmkvm5eFSeq0bYoMXFHg+itKV7wAZp7GwyWhxw2afFyQCGOpqrhVF9p4QAThF5tG787agIloz5tEQ6+j8VvNwNrlT4VjedlIVQDBVMDZh1GVshFPBSCk8TX0hHNrzB4+NYNt9z/k1ggl8Y21uu4mk/5hGfw3Nihi+YuUxHHcAJ83yQDdL3qoB74FEYVVT5C7RohnOtDhhdUrUud+cm6obfDAab26VDYIHdYvoJ0kmDFOJMTqvxeZu5s6CzpfEfhtam35k71P1AdMmIf19ODKlmiPbMa206+QhSZESVcrjp5OFLbSYyskioYpSMIPYjdcb2cAi0/8loVAK31Q6lCSE1ACEDz9B3oz/m5gPeU43HDv5OIPNwUthBe+x3kN/jipTFM8RHCy4hkSKKyJYjpX3B3dV1e+3efeAwG3W7d3wMu3duvxp9xANojoNo/e8/Eyj8v999S5P/R6IOmKQmQNFavUgWWKao3tctxclYp3Ym8BhBZxJp+kWVJpFwL7RseFT3KkHaNhFpY9pydgMOLdp0NTSMLGrkmMqUv5gchMlYoUDOkaiQYMBf9+W+vTeQ/zz8+htkselfc8imrumduQq7d+aSRxVXTh5bsRSGzi+GiBLREWuBYH0IyxVpt/140OeuR8qooPIf6zK135zel2T23Ck6lva/h74YCb96EAE6ICJwCdrr6qZx2EGp6718bvulaO3eVZLxk/V+h/02q74DvHYbXk+iJDEEfqd9IrlfzOfHjsVI7gPBOStd1gEEVXtLC5nf20f8RZLksGj3OSz3sQEvWe6TpY7gBjy3hjnWHw2HTqBPd6W6w1g0QqXrrcl3QNKbvai9esC/OBX133P9WXpRafeK7h6DKt2jk+ibHFHC/OVRWSAhWpRD3wY+m5lErvQM5yJLcMiSk2cZnwdMbW06PPdZNHLWdERmSk41hLiidM9+J9wBY0sWLkhNB6SBpoZzjSqp9oyrrHlgXPVSeHPxyu6YT6/blUtWQ4eZwKsRPvhOcvU4+9mZYOwYhPjgBfFIpF5gaGfLqdr70KqsIP+x6FtfTedLzrcl1N2tbMbOe5ASt5P6sX7v9G7LoyAYojIgba4mFBKB5sYyjyN9fcuqb72SCTjRF7Rn2cxkDxPLn0WOEdA3OxqPx8ejz9g/cWZ7hySdZIIvIYjjoYBnVd2XH19AnluEbDyk+XDfHUluaYZJkftGQnzPaJFkeJbAfxkXQ6Mx3xQ0NQVIxz7H893r1DKtHFlPxtGeF9CKkFg9HRfwk1XVN6El6+pJJ/Fco6mz7U6PrQv8LnXzICfxT0jqCXjiK4o8l3C7nTlkxyiigANmz7sQ6eT2c270WlRRP7q06kfZhWVQvWWr7sjxY/DZ7s/70j7fHuKLBbzOe/hgYCwBgtXYUZZWbAbLdnSZkP6GyZKTDS0nD9+AlqktGZAcuItsWxeXwioA4onETxCgD5hbGvv6HPYFhGIzfu/6moVFF5K27WrvgIba2uvRYtWi2XKFGc/TLfXH1KmAlpN14HNaqfS2f9j5TMB2TtAuW15UDoPApybNXW6YOH5M+lmp86OJqPRUev/PCEP/x1sSanKeRKWTUYWSOA4khnkAH6ZNOdtyEd8sEQoGppJJTTKDrcZQmvV9why3KGUNM+fg1KiREOOdp4hk6UpYp0jo9EfEZzIBmrZW4RC/npTX2d5O9tK43e9xT0OFn4Yg3SQLgnwW4FCZBZ6ztrS1PKhGo99+D0xevPK60aXVTanlN9H0a6iIxUM6uTwnr/iC5157kyzHodD3I6u2L8Q6NSPQvPrWkxPQLztBopXDfPBx0ulg3bP8TitarPbXkQqikYlVhQLu4Qi8mMAGPjx17MClO7dtIuBIWsxYbAUCNtzVemoY43FXK8lFsVOTI4fRLIeF7Ddi/IPAMmFsvx1DB/9JZ+lsTlqsmEzZzAZYurgaNr237lKkre9jm8VaTtXNQzA+YGxtuz1gZhDUIXVCOSzSFyHSDvF0QGhvqB/qNHbeTrucV7EknlUD3HdDyBC5HArpZI7MkXEvK2nfKZMihgUX+g6P8AGPOnWQUKJZIZ8fMD2BYAxkDLB0T5AjbapG5QUpEqHkGPENhdIMsKmJLBPxuxyzUfnJnhxkdQB4XQ5Cm0AMBqf1oLapSJfIZ/tqD/chdR9cXAGjCsufH1lcGUhZtPR732Iji6tiYytrRo+urIHB84t0SNEoh8MJnXp9X54JHlaX2oRYjhxRiQtvfOJauPwn6m5iOq/LChZD20CkxmRyLqSEQxHMawu4rb9LbQ9Oomx0JAQuKgoryBwedihmsl1CiGVOtTW33Nje0kqoei81dEzgx5PR1YDblpwCkMI6ZADJ9k9EKRJCZe8y3Yb3bcXrJdCKO7E8D4Lvvdq9+3ol6asDDO2tTyILUdeeoa/rwuvZZJH/G6bkc9FCqr79Qnp1CXtbTh3UUBalluMomdH+MTlyEB9m37i6nkqkJJalIt4ARHz0/WiFjD0AF0tOetPlJN7w0KmTpDfvgxZiZw//jQyMuHwu+2/JEhdSLlkdEKT9ukRYyUJK+YFydmiZGjjttNsqiQJuOVBLPTM9F7Lzy/Iy1r5lLMepdI8srfoDJhg4r0BH4v+IvDDqNcrv8/Ynq7ejkcgBJuB9u6vLeo0cUfe2pILoSxram8HQ1no1fs9DK1WHx8201/GXtO/WUHcU5EhYDWXyOx1PIKX8B967PhzidlhMxt8l3z0QpX772OPwbP8BvTgmmIfAPm0zdjyR8hGp5I5l6oJcpLA+pNz0bSEmeBwpdQe2RzvWz5xQlHyssrpPisVohI7mlpGs39euCKFmpNft6DM2uu3WP5KwMo60W8aiT3UwRbWM4a9//olod0TPuX8nm/T+663Lk6Fc4dT1wmpeUWD+MyX8b5JELEr50WEP2u03o6Wr6+G/JRechvgVk8aOpD55fzMwPi+EGTYVAkY/icrhVXoMnpBIEoH2zYjFZAgjMKUg81tUkK6MstPr6uoUgb8gOV/HIK1lUBH9EAkGfo4Woe0rAA2LosVieTGt+OPy8nuhddt8rtXdo0qrD4wqqbx2dFk1jCqtoi56+GHgwyJgnSgL3m9dff0V+w4cuFJVuGgUFdYLksCBvrUN3C4bdbj2KMAFQLby/uGAvzyqi0vJRZ87P9wIJqsV7DYz5bZ36cRAAErfntWr8dixu7a9v/Uyt9WmxiQC/FjtzLw+n67ueO319ccP/9TSeVpXu3cbWA0tatvn/n0tGDtaVV/wZN3xC48dOnBn3aEDPzt+8MBdtfsO3nl47+HLJQRmW8MpeOv1mXDs8JGrj+7d87OT+/fd2XT06B1Ntcd/cvhgXd9jtQ1gNdmSz1MFkIxA5rADI1unn3u6IBlLmdyINypHzlowmvTpE2oi86i030nxggAcz2X8P7ktuohtFvDaSbwphZ0S5bKbKaNJD6LIgaJo7xg4S8hynFhY1IlI6USGfhCBxfSgfQgeUQkxzLD0gEJbewdIPKeLsCxZnjNUPpuCJgdNRPS0fJ6X4okYgieIAA2OQmBmTimo+figb/XHH27ote2D1UiZrMR/0pEhdCkcehZprJRRppqfC9Imm8WqTgfA3f0gJ7/kNqSRJzM2Czrjv5UtWjV4Vj68MG0O/HXmXBUstWht9cYOMBk6wNDZAR3tLbDto62E4kHQ54bD+w+o+To6mpHadkEg4AYygKK2FdmvJGiFA3V1UNfUBHpDGzhsRti//0v1P8cOHoQPNm0hSkrNyVsLYSyzBWmlCa9n7GxFi3kayJ7/Ha2nwWrUQ4IAWIlDe8tJMLU1gLmjFdoaG+DzT7bBqaNH4dSRY7B3114wt7bC5o0fQcvpk9DSUE8GYODkvn1gaW7G31rgdMNpaG5ohs7mVtXCKGiR9PsPQ9Bvg4DbBCHGA3MOn737cdL3TA64cJwffL7ktnvOlmbsHAMgkJeaeHwQ5SLgcVigy4L3YDKBzWFHECUtZhw7UyPeh8tlA5fdCB6nGTx4tJjboR3vhaRw+F+/vee/UpLbKSSHmxEk49Mb/2Su1g7zrJ3xee4gC0GRtlAxLvkubIb8RwilF5yeRUERNJYww9wSYThwJRhSdtp/O2sbvEiIGZgGsrpdQ3rpiyy9HT3HSnOfx7Nj05YPLid5Hp04BXIKysmLFv09X7RIQDeisPytkUXlxMejlm37ODnXVXv0B22dLfdZzIb7rCZDPwTC/e3tzTc0NhyHtpZGqD16HBrqG3Sd+pZbjPrm3xjw6OfD6qSyz+eAupN1UN/cBKfb2y/r1Lf+wmru7Gcx6a8QRE4t3242UQazATo7iNK1Q2tr29VGQ/t9DkvnvTZD+70dpxv7tTU3Xt3a1AD6BqTaJy1IX5uu7Tx94gFjW1M/m15/FZmSOLz/n5TP7qCaTzXCkUOnoPbIaaqx/vhtrQ0nHuw83XydobMJPGbTrQ59xz2mjo6+RryWpbMTuKC9O+ib9ll/6ncZ7vO6zD9IJMg7AQJJephawhPHOsciMgnAvtLn912ZnhoiAzAhmkbAeYH3073dduMvEES3Gc3WLL3JnAG4MPrDbWB3dF1lt3b+kuRzWvW/MBla7m7raLkEE4RF9uvU779PyEadtEUPgS7DxRLPfpymcN3giagTubstbW3XkOUjjNtNRckAC8Ni78feioBrTQ2qnL0Fg8B9ygY8F4toHbDHvBHzHTuLHpKtBTjWy3hcvwp6nMD5vTo+SFNeJ9n113EN+jH7e05NkBXWLBNUR/9Wfbw9a/D8Ini5anH2qOKqeGqz127/Dc95RxdXPjq2bBFUbvmQWvb+Rtiw7f0LvT7PcrwnJ5avl0TBjJTW67R3zSebsvJMQOfHunjdjmtDDP052Zck4HUtIdcrW1oEEiqoz+vWubCOHpdzQIilTXjfZuxcagNuV35T3fGrm+vriE+X3EpOkdDK+Cegn+Uk+dCH7ULqbNe3tQ02tCfXv23ZsrlvwOMqxWs5IiHeFJXE42GBn2PSGy/sMlnAYbVQ+/bsgc937LjE47BvRTbhcVstY+xd1pvx80FZ4He0Npy8pr1RfUEHJSAlZ2g/eJ3W+yWRPxqNiF1I/V5XnzXpELo6Veou8ix5L8D1AkcXYHsQv3F/LBIekLtgMZXUi5i68S1D0w/jdTrRz128a+fHF36+8xPwexxp0KpLfBQp/CZey4nsxID1t4ls8JTR0PaQyahG4mgbwaZF5enq2imVi18bk8Oqz0R2V+5WclEg/tvcpAUM6RQEW+vhZtj7d/K+M7l71DHag/opEUHd8Soq8tiLCr/Cc+rC1Gh6/g0Bhw9mn6Wt4brWuoPgd1goVIQsng6QDUZ/hgroyaS2pHyBYzlU9scDPjJSGtWNmlnUa0zpwmqyGiBNJ8m0QCp+smli1ZJrJ1YvgaXbPtEdra+H+sbGK3w+zyYsOxANh8m6Pi8qSr3dZhmSiofUyeEwuO22cWRonlzfbjasSQ8oSGG+2wKjgparbcOzXnVukGMTHqtlqIesiYvHsqD39+GDnbv6RCXp78RSSyG2DcvsEJhgbUtD48NHDxwC1usCn8N2Bd7vKTLtIoU4d/LdDGEvKvv1ZHEqdgpZtNsNAY/nugjPd5ERTNrlmBj0+55V5ynF0Ka0ReNoXwoE6hq+IjL6GlNXHERHpVkEWddXe/hL6Giry8L2XozPKUZAqdL1gP+fprbWC50mYyrqKEE2ql2QYjmvpcswtbcB+tHUvsOHYd+hQ9eGWOYw6Zgxz2lskw4y2GXsbL7OpG/VAJcpxH+LKjKFCWSefxYfNNfTf4vwXCTo8TzvsyWpSpim1WM8EnkVf8+MiczYvyTUFg4xt4UYfzrvGCUZxnXWPifRsPBe7ef/6JOik72MLc3Ja3BMSY9yU9El/L4TzY3qkn/qkT/DyMLKHyC4Dp9rwntkYfkHY0vKLx5TWAyvllaC0e6CkBju/f62v18pi3xVap7wnabTx3+gt9oueqmqGvZ9uQf9q9YrQ8HgntR9xGzmzsK0QrscVoq86qmpsf7HqGQkHCzoMbW+kIhKm0l5rM8zifOTLem4XkFsJ6vFcjvPBAlIOt2W9geajx+9ve1k/U3HDtX3VsuUJeACgXvjshQUmcBeu6GlP1o5OwLAir3BD5M7iklZZFDD53IORGXm0J9O+OzWfOw0ZpJrBt22qbJAgpcTlNduoyz6TjLPeBta7qbklhXqfn+PxrBzVdRdykjMZQwB7CRbVsjooK8VOe/zCOwYWt8ma2f7xS6jIdUZkwETdjv6c1Gf0/6412FDmunSOSxG8HmSlt7ldP4a20IQGLquvan+F1aT/labUX91l6lDfe0V8VE1SQkZlSKviCJ0KsIxRT0msNN7ROrR+jzs09sudXXqrxYD9E8lnp+LD/sMOM8ENKf8N35mSkl1/eAKsuwnt+e0gVo2z7UzXte9HFo1BCjYjIaLhGDgTVSmntuqR8kEdDDgm5uIhOGjfQd6DZpfCGNKq+7OKapwpF6uiJSyIjX/VhkfU1o95bV178LYhcvgubfeAUEIwbbt2+GLPXsujivyp1gg43FbHvK4utKhXGS3LUDFeUbkOS7EMCQwO+px2qakAcf4PTqyczJDe/shqAS0/M1eu+UZvKcGQk1dXaYH/KiUfDDQiwvS6E/Rj5Ot9MSgX7VCPkcXbFm7Fk4ebYKIurCVBZfN/iaxVAiqCT6r5QfYJgx+r/XYLFfqW06TsrKQjgLtdVeT5xOXpJjLatqB1uwQ6SBDQf8DsQh56WMoY4t1ehIpk9wD1jOEVPlhTFifQHdoG+111RDASiHmxVgicX1MUfYFPO7yA/sP9P3rMy8AHfCAXt/2M7ymBdu+3tDaeEPn6XoEnJMiAyVnrhXMIRbcYTaoe9GY0G9razqpTquQV4hpkpLU6m5IhLAnE6Q+qFwfJamgOviRVnb1rSioWJ9JodAOBNpnSH3SQ/U9YyhVKyQJXC3SmR/TXsLzwyl/IDG7B+C65+qw7EMCF3wDe9Fp2Ltvx/Llc1k3pJOtBrPp1iDHwKbdLXWV+QAAEf5JREFUe3XD8ktgTFn1CwiuUBJwlckXdhSQ+Mmq0LjKxY+Pq1oMYysX6YbMqQCODer02PubjIbfokJy2IMfw/pdqu6zIkWo3j+6E6bMmEdWpC8jO2Dp29s9CUWJoJ/2JBkaj0tyt0Kj4k5S68QyDPFDSX424J0jsCKE1O0HUrsh0/55qmXmmCNRWVpANtpRl9tgWWjVSEILwm1AHy9h1bfPxXotIbGa+FwK1HbDvJaTdrAYDfh8wtvVLdFZJoI09zgCP4TtVe9x2L6HvjJ5xZQOAQ/OLtPleP4glhVxWK2cwAYDfrftgYDbRrZNz7Kb20Dfduoi9Nf2IqVnXRbDY1tWVhMq2qubmgZpHVnDZzUZRpD3GZBIm7iiJPetJJbeboYN65fBPzat7oOd0IZkWwR3ITDfiSuRW1PbLGhUMlMInZS5ICUh7ZOYQD9FFAzdAyb/eu1bz8WmZ4ENQYvgZJ+KoR+EPhKV9icwDULfREkBLvN/aVCTUc3MdxOcRVExhTgmOJQ46NF4nHpnxQb4/Wtvw6jiilk9RyZT9FI/srji55hgWF4xtWjz+8l9EtGCIcV7gcRiokKsU9uB+DsIRvKbJIr3x2UlYOrosJ86UWdGBygkCcLteH01jGv3Zx/BlvdWZqHV+UeqXmRHMwVBx3vstqdFmkMLyVLbd30Cp0+fupAL+r+U1fsSRJFnw0G/91km4CVbyGUZEfxmo+FmtEQnybsXsAyOLIZFCrefo2myYxbWJ6TzedTIm99gu9nQbwshtfSiJfKmdn1etWnDmr5/fvQ3JDRP3YQW//sCAlm0GNq/YAO+LqTnTpup/ed2cwd5A0+Wy2ICm6HjITksBPD5fHlo65ZLk/QxDmvXrAZCiZN7SsaQdXALSJ2CbufrYbTYYZbRBZw2QvkpPuBDOuy/Ctulkfif+LwVZAduV5fxQafZAIrA6rT1eRmSkNU4P13qdcAvpUCTsWL7K2+p6U7Rr64eIAMQDKbxcmrYOSqwJJRLF0M6FI8Id+F/0uvrUpQ1fM6ye1o2VLSQHAm/cSgR1p3wdUGj2UzBjb8FS8IKw/NKNvT038jrqJBmfjayoPz7mOClt3MpMmQPlwBMm/tWb46hl5OtC0IcPTgzAj9pkXzFxMJYzSaP3+3iwyHe53E57/C53QSo5AUcIIWF72Oe0zJ514fPMTDMM1sIIwj4XK92l0fee+13/xjzdYksbXCa20Y7LPo/tTY1XFN3eB/SOUcW43ejwnqfRoUlWzI0oFU7RcLcXBbjyzK2HVI9HXkfgKr4HDssQgK27dYjCKJmNbAb/Uu0dkNS1kS1PPXHa3shYD8gHRgCuw7z8WjFmi2GllvMnU0QQqpLnjcykBxCdZHOFHnd9JUINvIarT8Z2jsvfP5Pz0JD4ymor6+7FlnFYXwGAaSL/chW73hN6uiB/UCsM6GxTpv1j9iRcugGHDW2NA13mE2PHDu4/8JD/9xDRp3Pt4p/u4SMgJGH9BCoS3NK0uFcZHDj37z7LZYJtBQozOiDjODrv1SVNxbmSQ8HMh/snhOKRoQ85cySmySovvomnrNeuEgeJvbCU/e2dmY5ZFndgeqRiVNgxsZNMGnxyu+NrVi0/1yAG11WXfrqiqUwpqKKemHabECFppzoP7kdliuRLjWhhaMREDcHvE60Nt4sh9UCxo72nyBla4tK4RhatiABJc/QFrfDeovTZkEwBnQC+lx2q/WvaAmFMBv8Z2dD7R2o4J+RutJ+dxrAOonjwWYyjlF9Yrxv1Wdy28HY2Qy2ro4z854R8XWySiHksZFlONMjCDiHWT8e/UK0RnYVRHf+5FYyyLEIO7O422bMRfq5l6x2RwrndNu77ifvI0d62UuduA94HyOv2UL6hw9KZtQ3+4S4Pab2hmtOHNmtXheyridD+UvIigSvqf1Fn9c7kqz3w3Ze98ivHyGDKjrSwfg97n54v2KIoQ8k65rcFi8iioRyUugYgtPaNZtQTvQjX1e3P0dfvOlELTSeOAqKyP1bHfyvEhLOxZD5Iinyo6gopMO5/tW73zJTIuXrEaoUQiv2Ph7vCwthaLe5U6+6UpIDMlwAYhGRIlYOr/PjWFTaqW7Uc/bynJ6WLaGCPyI0Ifpf/HXnKdhGRi7l5AMfODuPGlu2EDA9NKq40tTj7aZxtG5KTnHlBEInB88r0O06fjT1FpcoOFyOu9Avo2mft/ajbVuv2fbh+0RZsxSeA7/bPYNYEez9V0th/iGkaMGg193cfPLo9Q3H9qvr1eiAn6xmyI2ob9lhdiGF2qKIInnV1LGOlqZr2hpPEkqXhYAmx2pCxxBExQjeBwWOedRmM13ucFlgy6YNsPeLz76H1HJ3TI6IoYD31wiiInJ9m7HjZb+LvJDenqVvawWH2Xw9dgQt2M42BOGDYZ7/IjnNwG9vO1n/vb0ffZAE0gVXkMXDNYTeySHmDQTKeHW7c0V6b1HVO6p/NmHmHPjiwIFLYor8IboQcijoK8MO4wha0BDtdjxFpnDUndWSNHsIuTefy/EF3uuTeO5BTBekO1AVfCF+E/6WcNks+QjihxVZesBtM1/IqG/10YKouyXZYHGKvEMa091yWPSQnh0tSoRs+U1exNedJDVJ+JuayKauEZ5tR4u1RhbZv0VY/yWxiED2jUwB7UxDJ+mqDGd8uehNWNYKVARGObdvGE3E5HbMVyTJodtVusQj2FIxjANnzEEaWUqNKqoATNkIsHBGsHKUbBiEFs4xrLD8seySShgwZwG198jRbgVpbGpU33MXYpj8tDX6cMcnsHvfXjLMf5LQV3N76yMem+2eRDSqBDzOut07tv7g3bU16v/Lltf0VaTIp0QR050Dmeylve6nk+UpuhPHaqG+7vgVaFX3qltTJIMIyN6cJzvaGm+qrzsEAZ8P/TLnrUjZ/KiwLSa9/lak2B8TgBrbW19127rIe8R7iQxDtt57gITOITj3tzQ3Yz7xc3WxLMe+QzaNRZrXK4B+obrbsqIQ364r2GW5zm23j0b/E08rRcT6YAeZlbasAs/OJGUQ+oz/Vzjar1phBCe1ccMa7BA29kH/8z2y0S5hNSQfWrVOh936I4/bCfsO7COU8x6y9TxhAkryfX1YROzv+/Z81ueKq0ADXE/J6KkuwQfySDwq/w6p1MPY6I9gQz+CjawmbNBH8KE9gr+pR6QQDzBe5x3WlpN9CW1UxGDy1cSpQNZzSTwZTEuhhgKtb+mL1/gD/idfEfkP0Af6MsIzH0oCuwiVAmmZ9NNk/SLqSJeS2ljUj53DKARRTkkVNbK0GsaUL5zTc8MgdYeu4qpT2aWVN46tXqwOmDR1dqbCmSJw7ETd81abpRgV4xc2mxVa21p0R2qPwMmGkzcpsjgPadbI2iNWnc1guBc1rcBu7hy8+YONfa6/41qwum3Q0HzqMq/LMTpE++Yn4tI89M8mi3zwTtKOU96cAjarmTKbDWA2668N+tyviLR3DudzvIO+Xj7rd7+Y7ujIAI0o8leRVQoeu3WYsdN0JevzDvU7rAv07c33iRyN/pZPbVOf0/Yz1uee77Zan3t/y6cIwsBf/U5bnsmg/5XZ2Ak+t0MXCtHknW63Yme3gHY6hu+qN5Kdsx/EjiAfgft7BBQwPg/l97nAH3BDKMRcxfo9bwlMoIYP+v/YfrrlcjISS7Zv0Bs6oLOzvTcT9AzHNpvP+lxz0eLmGdpbRx/Yt/+iuXMLwYr+nMnQ+VNE7DuJuJyH150X9DrzONr9+xBDBl1k7b0CPSWTGpARKgRcMphVkdApjpDtziEuSeQVTcnzxOeLKuqW4EG3A+p3f0yiSNT1V+Rh/TtREqwKILqpTrV8A8i5kPcCxme9OOgxXWCxHcsi74+WRDpVJ5kSeywZmbp6I4xevBxGVtX0RT9t7b/YoeuzSUtWXDB/64cElDB25Ur1v/f169d9v+r9x1Nza4nMrb4TsP2j7Wfy4HHT2hJYvfAtOGT0woGTrWeXQWiVwKrH48eOJH8LS+Bpbe/Rvqk9S77YAnt3bITLySqCjPMzX5/c/VnKKJuk8S8M6v5cd2j3OctVr19XS2X+75qvPGMsGzs8P42A45NtPCH7CR2ZGqqvrQWO0ED87D92GNp3bDvrHtNp6sSR8Mh9t8CxvZ/DzvfWf40+JTQL11MSKUWLJ7cJ16UmfnXJkcvY2Uld/p86Jkc21S3ZVCv0H6wyjtTtTvt31KibrgIhQDZZJS9714PFegwSEYWKySKVfAfBVyMUpm/YTGWXVkFOadWPc4oqD5wrwmR4funywfl56ut/Jy1dCTPWvJv88wVn7jsTNGwkAmyKBpNzXYZOmPjcE93f6w99AicPbkv++ck5XwFcMjQO66uc2fHY+C9AYWg/CbTbCNVVK886v7K6vPtzPBE/q57rqhZ1f244duArZabzWtDqpD/T9ma4Q/fVe02Gr8kgS4JKLWdM6q+ubCCvLEaL3Z1vfKoc6HE8vHc7/HPHJrDo0bfEduqpT+m8mnyLRLWUqsVU1Iccl8m0AZ+ikDJ83c5T09f+XZdTjLSyuPJXOUUVXekV3jnJHbrUQZOBc/NnHHMm4K2VW2DK8rXd/3U7zWDxOMCJtMnHBcGLtM0b9IOXTiaa8YLIBYClbSCSKBEPGdXUn3V9QfCBxDNoxTApHHmh4lfqKMckNZE9TxIxARPJS15HTJbiJCPnk9Y1nlyegyme9J8gLtDqNuYikxxSTyhBIFsLJkRWtZwJ2YblhfE/LAgiAyLmJxJP8CRsCxkJr5ZHRBEETIwarS8j7T/rGZBFoqR+cREs5kYQWNdZvxNmocgsXptWk8z7yZwb+P3JRaUklpX2e9EqOiBM20Fh3KDwPvj/2rt73zbqMA7gzxkYoBJCDIiBDQRIsLAggcQEDEiVUNskTe2cz3YTp2nqqnbsxk4dO4l9L77z+c4vcWpfY9e+lrQphaFdEBVsDJWAgX+AMoIAAUMEUYGfHSdYaaVWbdDJ1fcjPfJNp2fwo9/93m9v/EqbGz/f1/8AHNJtKe9zgnS29ZFrvFAmFu/4VfO33hkmt3dO6MqZvwc0472gWe3ekBOqrPzP2QM8omK2TdPlOne8VGMFVxwKqOZfvePw/u4ruB+CRvllFjRpVFzx1kWn0wYYTKFagxLVNmVWrxAv5cN9e9/6l3TdFJTCCywobLWwlg/gQR0v1+jMpU9I/uwLGl2U4zs7vJXCzpEKLOzhdGbfwdQSRVdtp1MGGFxT5bO0sPoxla9+SaML8tx2wW2fYRLoXElVKM3NWTadqljcqWbr3i8FgLubMleodO1zql2/QZ4FOflfwW3tFuj048bzRaF3QpdLWl93OmWAwXVy2aJDc2n6MJ580ivmL+9aQ8me9Z94WXufVzTyKnlXvNpwOmWAwRSutzujjpxfNciTVd/a3uW9NQe3c4fAN2Oy9uKYnCevrHOzF9DCATyQ0PI5GltUOPe8SO5F+RifUf/sX7TcGTAZ18ufjmj5xwJ2kwLsszK9ftXptAEGz8xqm/xqkUYSS9z+0CwdTonhIylpY3fBBY1KaziSpOGTsxQsrVDq4hWnUwcYTKGVBh1JitzB6DwdSiy+6U7L3+/uwwmKsTwhaXRMkYmXTUq1m/d+MQDc3YnSWW4okaYDifSzY0u5b+8cNCmUJjWNJs0ceSWDkpcvOJ0ywOCK1Jrc4TNLxOIZPqPdvKOFk/WsIBsksNYtoJoUb11yOmWAwTVTb3Os78Y+LeWn+az2Va/gNnt9uU1Bzk/7pCL5JJMLW5gSAHgoM5ZNQ/MSC/kpVnDX+gquc8vpL76c8UGwUKIJvcRFsKwL4OHEWBG9MjJKb/h8Lq+Y1/sL7qhWvDVRKL46VanSdKXGRWqW0+kCDLaI1aLTDZuLWE3yq4Y7kDN7OwWMf/yq+V2wtPz8dNWieHsNuwQA9kKsaXNHdZPGdfM1v1L4WhDzfwiS/qNX0hMH4guP03MvsaLE6CTAnpipN8krqsRnc094xdzrfEZ515PNve2R1H2enNG9uCNyHku6APZElH1OsmLrhiCy34xCrODILcrkVgp0oo7JboA9k2ivbYW91u3Pxazzrug52xVt2BS11ylmY+4NAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgkfEvo1Rqu5u5W1kAAAC0ZVhJZklJKgAIAAAABgASAQMAAQAAAAEAAAAaAQUAAQAAAFYAAAAbAQUAAQAAAF4AAAAoAQMAAQAAAAIAAAATAgMAAQAAAAEAAABphwQAAQAAAGYAAAAAAAAAOGMAAOgDAAA4YwAA6AMAAAYAAJAHAAQAAAAwMjEwAZEHAAQAAAABAgMAAKAHAAQAAAAwMTAwAaADAAEAAAD//wAAAqAEAAEAAADcAAAAA6AEAAEAAACUAAAAAAAAAEa/vQsAAAAASUVORK5CYII=";


const AppCtx = createContext(null);

// ─── Data ─────────────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id:1,  unit:"Unit 1",  name:"Maria G.",  mac:"AA:BB:CC:DD:EE:01", ip:"192.168.1.101", minutesUsed:60, status:"expired", paid:false, lastSeen:"2 min ago",  joined:"Apr 10", dataUsed:"1.2 GB" },
  { id:2,  unit:"Unit 7",  name:"James T.",  mac:"AA:BB:CC:DD:EE:07", ip:"192.168.1.107", minutesUsed:34, status:"active",  paid:false, lastSeen:"now",        joined:"Apr 12", dataUsed:"340 MB" },
  { id:3,  unit:"Unit 12", name:"Luisa M.",  mac:"AA:BB:CC:DD:EE:12", ip:"192.168.1.112", minutesUsed:60, status:"paid",   paid:true,  lastSeen:"now",        joined:"Apr 1",  dataUsed:"4.7 GB",  plan:"Day Pass",  paidHoursTotal:24,  paidHoursUsed:6   },
  { id:4,  unit:"Unit 3",  name:"Deon P.",   mac:"AA:BB:CC:DD:EE:03", ip:"192.168.1.103", minutesUsed:12, status:"active",  paid:false, lastSeen:"now",        joined:"Apr 15", dataUsed:"88 MB"  },
  { id:5,  unit:"Unit 19", name:"Susan K.",  mac:"AA:BB:CC:DD:EE:19", ip:"192.168.1.119", minutesUsed:60, status:"expired", paid:false, lastSeen:"8 min ago", joined:"Apr 9",  dataUsed:"2.1 GB" },
  { id:6,  unit:"Unit 4",  name:"Andre W.",  mac:"AA:BB:CC:DD:EE:04", ip:"192.168.1.104", minutesUsed:60, status:"paid",   paid:true,  lastSeen:"now",        joined:"Apr 3",  dataUsed:"9.3 GB",  plan:"Week Pass", paidHoursTotal:168, paidHoursUsed:51  },
  { id:7,  unit:"Unit 22", name:"Tina R.",   mac:"AA:BB:CC:DD:EE:22", ip:"192.168.1.122", minutesUsed:45, status:"active",  paid:false, lastSeen:"now",        joined:"Apr 14", dataUsed:"210 MB" },
  { id:8,  unit:"Unit 8",  name:"Carlos F.", mac:"AA:BB:CC:DD:EE:08", ip:"192.168.1.108", minutesUsed:60, status:"expired", paid:false, lastSeen:"15 min ago", joined:"Apr 7",  dataUsed:"3.4 GB" },
  { id:9,  unit:"Unit 15", name:"Priya N.",  mac:"AA:BB:CC:DD:EE:15", ip:"192.168.1.115", minutesUsed:60, status:"paid",   paid:true,  lastSeen:"now",        joined:"Apr 2",  dataUsed:"11.2 GB", plan:"Monthly",   paidHoursTotal:730, paidHoursUsed:180 },
  { id:10, unit:"Unit 31", name:"Bobby H.",  mac:"AA:BB:CC:DD:EE:31", ip:"192.168.1.131", minutesUsed:5,  status:"active",  paid:false, lastSeen:"now",        joined:"Apr 17", dataUsed:"12 MB"  },
];

const INITIAL_EVENTS = [
  { id:1, title:"Sunday Morning Service",   date:"Every Sunday",    time:"10:30 AM", desc:"Join us for worship, prayer and the Word.", category:"service" },
  { id:2, title:"Wednesday Bible Study",    date:"Every Wednesday", time:"7:00 PM",  desc:"Deep dive into scripture together.",         category:"study"   },
  { id:3, title:"Community Outreach Day",   date:"Apr 26, 2026",   time:"9:00 AM",  desc:"Serving our neighborhood together.",         category:"event"   },
  { id:4, title:"Easter Sunrise Service",   date:"Apr 20, 2026",   time:"6:30 AM",  desc:"Celebrate the resurrection at dawn.",        category:"special" },
  { id:5, title:"Youth Group Friday Night", date:"Every Friday",   time:"6:00 PM",  desc:"Fun, faith and fellowship for ages 13-18.", category:"youth"   },
];

const INITIAL_TENANT_POSTS = [
  { id:1, category:"announcement", title:"Welcome to Community Board!", body:"Use this board for property news, maintenance schedules and community updates.", date:"Apr 19" },
  { id:2, category:"maintenance",  title:"Water Shutoff — Apr 22",      body:"Water off 9 AM–12 PM for main line repairs. Please store water in advance.",   date:"Apr 19" },
  { id:3, category:"parking",      title:"Parking Lot Restriping",      body:"Lot closed Sat Apr 25 for restriping. Please park on side street.",             date:"Apr 18" },
  { id:4, category:"packages",     title:"Package Pickup Hours",        body:"Packages held in office Mon–Fri 9 AM–5 PM. Ring bell after hours.",            date:"Apr 17" },
  { id:5, category:"marketplace",  title:"Free: Box of Books",          body:"Box of books available in laundry room — first come first served.",             date:"Apr 16" },
  { id:6, category:"meeting",      title:"Tenant Meeting — May 1",      body:"Monthly tenant meeting in common area 6 PM. Topics: parking, AC, landscaping.", date:"Apr 15" },
];

const INITIAL_MAINT = [
  { id:1, unit:"Unit 7",  category:"plumbing", message:"Kitchen sink draining slowly, been like this 3 days.", date:"Apr 19", status:"new"        },
  { id:2, unit:"Unit 12", category:"electric",  message:"Outlet in bathroom stopped working after the storm.",  date:"Apr 18", status:"in_progress" },
  { id:3, unit:"Unit 3",  category:"ac",        message:"AC not cooling properly, room stays above 80 degrees.",date:"Apr 17", status:"resolved"   },
];

const PLANS = [
  { id:"day",   label:"Day Pass",  hours:24,  price:1.00 },
  { id:"week",  label:"Week Pass", hours:168, price:5.00 },
  { id:"month", label:"Monthly",   hours:730, price:15.00 },
];

const VALID_CODES  = { "CHURCH24":"day", "BLESS724":"week", "GRACE301":"month" };
const CODE_LENGTH  = 8;
const TENANT_CATS  = [
  { id:"announcement", label:"📢 Announcements", color:"#22c55e" },
  { id:"maintenance",  label:"🔧 Maintenance",   color:"#fb923c" },
  { id:"marketplace",  label:"🛒 Marketplace",   color:"#a78bfa" },
  { id:"meeting",      label:"📅 Meetings",       color:"#38bdf8" },
  { id:"packages",     label:"📦 Packages",       color:"#fbbf24" },
  { id:"parking",      label:"🚗 Parking",        color:"#f472b6" },
];
const MAINT_CATS   = ["plumbing","electric","ac","general","pest","appliance"];
const UNITS        = Array.from({length:60},(_,i)=>`Unit ${i+1}`);
const SCRIPTURES   = [
  { verse:"Share with the Lord\'s people who are in need. Practice hospitality.", ref:"Romans 12:13" },
  { verse:"For where two or three gather in my name, there am I with them.",       ref:"Matthew 18:20" },
  { verse:"Let us not become weary in doing good, for at the proper time we will reap a harvest.", ref:"Galatians 6:9" },
  { verse:"Be kind and compassionate to one another, forgiving each other.",       ref:"Ephesians 4:32" },
  { verse:"A generous person will prosper; whoever refreshes others will be refreshed.", ref:"Proverbs 11:25" },
];
const EVT_COLOR = { service:"#22c55e", study:"#38bdf8", event:"#fb923c", special:"#a78bfa", youth:"#fbbf24" };
const DONATION_PLANS = [
  { id:"d5",  label:"$5 Blessing",   hours:48,  price:5  },
  { id:"d10", label:"$10 Gift",      hours:96,  price:10 },
  { id:"d25", label:"$25 Offering",  hours:240, price:25 },
  { id:"d50", label:"$50 Blessing",  hours:480, price:50 },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@300;400;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

  :root{
    --bg:#0d0f14;--surface:#13161e;--border:#1e2230;--accent:#22c55e;
    --accent2:#38bdf8;--warn:#fb923c;--danger:#f87171;--text:#e2e8f0;
    --muted:#64748b;--card:#181c27;--sbg:#0b1a0f;--sbd:#1a3a20;--stx:#86efac;
    --grad:radial-gradient(ellipse 70% 60% at 50% 0%,#0f2318 0%,#0d0f14 70%);
  }
  body.light{
    --bg:#f0f4f0;--surface:#fff;--border:#d1ddd1;--accent:#16a34a;
    --accent2:#0284c7;--warn:#ea580c;--danger:#dc2626;--text:#1a2e1a;
    --muted:#4b6358;--card:#fff;--sbg:#dcfce7;--sbd:#86efac;--stx:#15803d;
    --grad:radial-gradient(ellipse 70% 60% at 50% 0%,#dcfce7 0%,#f0f4f0 70%);
  }
  body{background:var(--bg);color:var(--text);font-family:'Sora',sans-serif;min-height:100vh;transition:background .25s,color .25s;}
  .mono{font-family:'DM Mono',monospace;}

  /* scripture */
  .scr{background:var(--sbg);border:1px solid var(--sbd);border-radius:12px;padding:12px 14px;margin-bottom:12px;text-align:center;}
  .scr-v{font-size:12px;color:var(--stx);line-height:1.7;font-style:italic;margin-bottom:3px;}
  .scr-r{font-size:10px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;}

  /* toggle */
  .tog{width:40px;height:22px;border-radius:11px;border:none;cursor:pointer;background:var(--border);position:relative;transition:background .2s;flex-shrink:0;}
  .tog::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:var(--accent);transition:transform .2s;}
  body.light .tog::after{transform:translateX(18px);}

  /* nav */
  .nav{display:flex;align-items:center;justify-content:space-between;padding:0 12px;height:52px;background:var(--surface);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;gap:6px;}
  .nav-logo{display:flex;align-items:center;gap:6px;flex-shrink:0;text-decoration:none;}
  .nav-logo img{height:30px;width:auto;object-fit:contain;}
  .nav-name{font-size:11px;font-weight:700;color:var(--accent);line-height:1.2;max-width:110px;}
  .nav-tabs{display:flex;gap:2px;}
  .nav-tab{padding:5px 10px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;border:none;background:transparent;color:var(--muted);transition:all .15s;white-space:nowrap;}
  .nav-tab.active{background:var(--border);color:var(--text);}

  /* portal */
  .wrap{min-height:calc(100vh - 52px);display:flex;align-items:flex-start;justify-content:center;padding:20px 14px 40px;background:var(--grad);}
  .card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px 18px;width:100%;max-width:420px;box-shadow:0 4px 24px rgba(0,0,0,.08);animation:fadeUp .4s ease both;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}

  /* timer */
  .tblock{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:13px 16px;margin-bottom:12px;}
  .tlbl{font-size:10px;color:var(--muted);margin-bottom:5px;letter-spacing:.06em;text-transform:uppercase;}
  .trow{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
  .tval{font-size:28px;font-weight:700;font-family:'DM Mono',monospace;color:var(--accent);}
  .tval.warn{color:var(--warn)}.tval.exp{color:var(--danger)}
  .tbadge{font-size:10px;font-weight:600;padding:3px 10px;border-radius:20px;letter-spacing:.06em;text-transform:uppercase;}
  .tbadge.active{background:var(--sbg);color:var(--accent);border:1px solid var(--sbd);}
  .tbadge.warn{background:#2a1a0a;color:var(--warn);border:1px solid #5a3010;}
  .tbadge.exp{background:#2a0a0a;color:var(--danger);border:1px solid #5a1010;}
  body.light .tbadge.warn{background:#fff7ed;border-color:#fed7aa;}
  body.light .tbadge.exp{background:#fef2f2;border-color:#fecaca;}
  .pbar{height:4px;border-radius:2px;background:var(--border);overflow:hidden;}
  .pfill{height:100%;border-radius:2px;transition:width .5s;background:var(--accent);}
  .pfill.warn{background:var(--warn)}.pfill.exp{background:var(--danger);width:100%!important;}

  /* buttons */
  .btn{width:100%;padding:13px;border-radius:10px;border:none;cursor:pointer;font-size:14px;font-weight:700;font-family:'Sora',sans-serif;background:var(--accent);color:#fff;transition:opacity .15s,transform .1s;}
  .btn:hover{opacity:.9}.btn:active{transform:scale(.98)}.btn:disabled{opacity:.4;cursor:not-allowed;}
  .btn.sec{background:transparent;color:var(--text);border:1px solid var(--border);margin-top:8px;}
  .btn.warn-btn{background:transparent;color:var(--warn);border:1px solid var(--warn);}
  .donate-btn{width:100%;padding:14px 8px;border-radius:12px;border:2px solid var(--sbd);background:var(--sbg);color:var(--accent);font-size:14px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif;transition:all .15s;}
  .donate-btn:hover{border-color:var(--accent);opacity:.9;}
  .offer-btn{width:100%;padding:14px;border-radius:12px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:13px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif;transition:all .15s;}
  .offer-btn:disabled{opacity:.4;cursor:not-allowed;}

  /* event cards */
  .evt{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:11px 13px;margin-bottom:8px;}
  .evt-badge{font-size:9px;font-weight:700;padding:2px 8px;border-radius:10px;text-transform:uppercase;letter-spacing:.05em;display:inline-block;margin-bottom:5px;}
  .evt-title{font-size:13px;font-weight:700;margin-bottom:2px;}
  .evt-meta{font-size:11px;color:var(--muted);}
  .evt-desc{font-size:11px;color:var(--muted);margin-top:3px;line-height:1.5;}

  /* post cards */
  .post{background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--accent);border-radius:10px;padding:11px 13px;margin-bottom:8px;}
  .post-cat{font-size:9px;font-weight:700;margin-bottom:3px;}
  .post-title{font-size:13px;font-weight:700;margin-bottom:3px;}
  .post-body{font-size:11px;color:var(--muted);line-height:1.6;}
  .post-date{font-size:10px;color:var(--muted);margin-top:4px;}

  /* admin */
  .admin{padding:16px;max-width:700px;margin:0 auto;}
  .stats{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:16px;}
  .stat{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:13px 15px;}
  .slbl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;}
  .sval{font-size:26px;font-weight:700;font-family:'DM Mono',monospace;}
  .sval.g{color:var(--accent)}.sval.b{color:var(--accent2)}.sval.o{color:var(--warn)}.sval.r{color:var(--danger)}

  .tabs{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap;}
  .tab{padding:5px 12px;border-radius:20px;border:1px solid;font-size:11px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif;transition:all .15s;white-space:nowrap;}
  .sec-lbl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;}

  .ucards{display:flex;flex-direction:column;gap:10px;}
  .uc{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:13px;transition:border-color .15s;}
  .uc:hover{border-color:var(--accent);}
  .uc-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
  .uc-name{font-size:14px;font-weight:700;}.uc-unit{font-size:11px;color:var(--muted);margin-top:1px;}
  .spill{display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;letter-spacing:.04em;white-space:nowrap;}
  .spill::before{content:'';width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0;}
  .sp-active{color:var(--accent);background:var(--sbg);border:1px solid var(--sbd);}
  .sp-expired{color:var(--danger);background:#fef2f2;border:1px solid #fecaca;}
  .sp-paid{color:var(--accent2);background:#eff6ff;border:1px solid #bfdbfe;}
  body:not(.light) .sp-expired{background:#1a0b0b;border-color:#3a1e1e;}
  body:not(.light) .sp-paid{background:#0a1520;border-color:#1a2f50;}

  .ugrid{display:grid;grid-template-columns:1fr 1fr;gap:7px 10px;margin-bottom:10px;}
  .ufl{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;}
  .ufv{font-size:11px;font-weight:500;}.ufv.mono{font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);}
  .ubar-row{margin-bottom:9px;}
  .ubar-top{display:flex;justify-content:space-between;margin-bottom:4px;}
  .ubar-lbl{font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;}
  .ubar-val{font-size:10px;font-family:'DM Mono',monospace;color:var(--muted);}
  .ubar{height:4px;border-radius:2px;background:var(--border);overflow:hidden;}
  .ufill{height:100%;border-radius:2px;background:var(--accent);transition:width .4s;}
  .ufill.full{background:var(--danger);}
  .uactions{display:flex;gap:8px;}
  .abtn{flex:1;font-size:11px;font-weight:700;padding:7px 0;border-radius:8px;border:none;cursor:pointer;font-family:'Sora',sans-serif;transition:opacity .15s;}
  .abtn:hover{opacity:.8;}
  .abtn-g{background:var(--sbg);color:var(--accent);border:1px solid var(--sbd);}
  .abtn-r{background:#fef2f2;color:var(--danger);border:1px solid #fecaca;}
  body:not(.light) .abtn-r{background:#2a0a0a;border-color:#5a1a1a;}

  .aform{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;margin-bottom:12px;}
  .finput{flex:1;min-width:100px;padding:8px 11px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:12px;font-family:'Sora',sans-serif;outline:none;}
  .finput:focus{border-color:var(--accent);}
  .fsel{padding:8px 11px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:12px;font-family:'Sora',sans-serif;outline:none;}
  .fta{width:100%;padding:8px 11px;border-radius:8px;border:1px solid var(--border);background:var(--surface);color:var(--text);font-size:12px;font-family:'Sora',sans-serif;outline:none;resize:vertical;min-height:56px;}

  .mcard{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:13px;margin-bottom:10px;}
  .mst{font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;text-transform:uppercase;letter-spacing:.05em;}
  .mst-new{background:#fef2f2;color:var(--danger);border:1px solid #fecaca;}
  .mst-in_progress{background:#fff7ed;color:var(--warn);border:1px solid #fed7aa;}
  .mst-resolved{background:var(--sbg);color:var(--accent);border:1px solid var(--sbd);}
  body:not(.light) .mst-new{background:#1a0b0b;border-color:#3a1e1e;}
  body:not(.light) .mst-in_progress{background:#1a1000;border-color:#4a2e00;}

  .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:700;z-index:999;animation:tIn .3s ease;white-space:nowrap;}
  @keyframes tIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
  @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}

  @media(max-width:600px){
    .stats{grid-template-columns:repeat(2,1fr);}
    .card{padding:18px 14px;}
    .nav-name{display:none;}
  }
`;

// ─── Shared tiny components ───────────────────────────────────────────────────
function Logo({ size=32 }) {
  return <img src={CHURCH_LOGO} alt="BGT" style={{height:size,width:"auto",objectFit:"contain",flexShrink:0}}/>;
}

function Scripture() {
  const s = SCRIPTURES[new Date().getDay() % SCRIPTURES.length];
  return (
    <div className="scr">
      <div className="scr-v">"{s.verse}"</div>
      <div className="scr-r">{s.ref}</div>
    </div>
  );
}

function EventsList({ events }) {
  if (!events.length) return <div style={{fontSize:12,color:"var(--muted)",textAlign:"center",padding:"10px 0"}}>No upcoming events</div>;
  return (
    <div>
      {events.slice(0,5).map(e => {
        const col = EVT_COLOR[e.category] || "#64748b";
        return (
          <div className="evt" key={e.id}>
            <span className="evt-badge" style={{background:col+"22",color:col,border:`1px solid ${col}44`}}>{e.category}</span>
            <div className="evt-title">{e.title}</div>
            <div className="evt-meta">{e.date} · {e.time}</div>
            {e.desc && <div className="evt-desc">{e.desc}</div>}
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared payment screens ───────────────────────────────────────────────────
function VenmoScreen({ onBack, onCodeEntry }) {
  const [amt, setAmt] = useState("");
  const v = parseFloat(amt)||0, days = v>0?Math.floor(v/0.5):0;
  const mo=Math.floor(days/30),rem=days%30,wk=Math.floor(rem/7),dy=rem%7;
  const parts=[]; if(mo) parts.push(`${mo} month${mo>1?"s":""}`); if(wk) parts.push(`${wk} week${wk>1?"s":""}`); if(dy) parts.push(`${dy} day${dy>1?"s":""}`);
  const tLabel = parts.join(" + ");
  return (
    <div className="wrap">
      <div className="card">
        <button onClick={onBack} style={{background:"none",border:"none",color:"var(--muted)",fontSize:13,cursor:"pointer",marginBottom:12,padding:0,fontFamily:"'Sora',sans-serif"}}>← Back</button>
        <div style={{fontSize:21,marginBottom:6}}>📱</div>
        <div style={{fontSize:19,fontWeight:700,marginBottom:4}}>Venmo or Cash App</div>
        <div style={{fontSize:13,color:"var(--muted)",marginBottom:14,lineHeight:1.6}}>Send any amount — your code arrives automatically within 2 minutes.</div>

        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:13,marginBottom:14}}>
          <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>How much are you sending?</div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
            <span style={{fontSize:24,fontWeight:700,color:"var(--accent)",fontFamily:"'DM Mono',monospace"}}>$</span>
            <input type="number" min="1" step="1" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="0"
              style={{flex:1,background:"var(--bg)",border:"2px solid var(--border)",borderRadius:8,padding:"10px 12px",fontSize:24,fontWeight:700,fontFamily:"'DM Mono',monospace",color:"var(--text)",outline:"none",width:"100%"}}/>
          </div>
          <div style={{display:"flex",gap:5,marginBottom:12}}>
            {[1,5,10,15,30].map(n=>(
              <button key={n} onClick={()=>setAmt(String(n))} style={{flex:1,padding:"6px 0",borderRadius:7,border:"1px solid",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'DM Mono',monospace",
                background:amt===String(n)?"var(--accent)":"var(--surface)",color:amt===String(n)?"#fff":"var(--muted)",borderColor:amt===String(n)?"var(--accent)":"var(--border)",transition:"all .15s"}}>${n}</button>
            ))}
          </div>
          <div style={{background:days>0?"var(--sbg)":"var(--bg)",border:`1px solid ${days>0?"var(--sbd)":"var(--border)"}`,borderRadius:8,padding:"12px",textAlign:"center",minHeight:46,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .25s"}}>
            {days>0
              ? <div><div style={{fontSize:10,color:"var(--muted)",marginBottom:3}}>YOU GET</div><div style={{fontSize:17,fontWeight:700,color:"var(--accent)",fontFamily:"'DM Mono',monospace"}}>{tLabel}</div><div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{days} days · $0.50/day</div></div>
              : <div style={{fontSize:12,color:"var(--muted)"}}>Enter an amount to see your time</div>
            }
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:13}}>
          {[{lbl:"VENMO",handle:"@ChurchWiFi",col:"var(--accent2)"},{lbl:"CASH APP",handle:"$ChurchWiFi",col:"var(--accent)"}].map(p=>(
            <div key={p.lbl} style={{background:"var(--bg)",borderRadius:9,padding:"10px 13px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:9,color:"var(--muted)",marginBottom:2}}>{p.lbl}</div><div style={{fontSize:16,fontWeight:700,color:p.col,fontFamily:"'DM Mono',monospace"}}>{p.handle}</div></div>
              <div style={{fontSize:10,color:"var(--muted)"}}>Note: your unit #</div>
            </div>
          ))}
        </div>
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"9px 12px",marginBottom:13}}>
          <div style={{fontSize:9,color:"var(--muted)",marginBottom:3}}>EXAMPLE NOTE</div>
          <div style={{fontSize:14,fontWeight:700,color:"var(--text)",fontFamily:"'DM Mono',monospace"}}>Unit 7</div>
          <div style={{fontSize:11,color:"var(--muted)",marginTop:2}}>That's all — code goes to the email on file for your unit.</div>
        </div>
        <button className="btn" onClick={onCodeEntry} style={{fontSize:13,padding:"12px"}}>I sent payment — enter my code →</button>
        <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",marginTop:9}}>No code after 5 min? Call <strong style={{color:"var(--text)"}}>555-123-4567</strong></div>
      </div>
    </div>
  );
}

function CardScreen({ onBack, plans, onSuccess }) {
  const [sel, setSel]   = useState(plans[0].id);
  const [paying, setPay]= useState(false);
  const plan = plans.find(p=>p.id===sel);
  function pay(){ setPay(true); setTimeout(()=>{ setPay(false); onSuccess(plan); },1800); }
  return (
    <div className="wrap">
      <div className="card">
        <button onClick={onBack} style={{background:"none",border:"none",color:"var(--muted)",fontSize:13,cursor:"pointer",marginBottom:12,padding:0,fontFamily:"'Sora',sans-serif"}}>← Back</button>
        <div style={{fontSize:21,marginBottom:6}}>💳</div>
        <div style={{fontSize:19,fontWeight:700,marginBottom:4}}>Apple Pay or Card</div>
        <div style={{fontSize:13,color:"var(--muted)",marginBottom:14,lineHeight:1.6}}>Pick your plan. Instant access, no account needed.</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {plans.map(p=>(
            <div key={p.id} onClick={()=>setSel(p.id)} style={{border:`2px solid ${sel===p.id?"var(--accent)":"var(--border)"}`,background:sel===p.id?"var(--sbg)":"var(--surface)",borderRadius:12,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all .15s"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:18,height:18,borderRadius:"50%",flexShrink:0,border:`2px solid ${sel===p.id?"var(--accent)":"var(--muted)"}`,background:sel===p.id?"var(--accent)":"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {sel===p.id&&<div style={{width:7,height:7,borderRadius:"50%",background:"#fff"}}/>}
                </div>
                <div><div style={{fontSize:15,fontWeight:700}}>{p.label}</div><div style={{fontSize:11,color:"var(--muted)"}}>{p.hours<48?p.hours+"h":p.hours<200?"7 days":"30 days"}</div></div>
              </div>
              <div style={{fontSize:20,fontWeight:700,fontFamily:"'DM Mono',monospace",color:"var(--accent)"}}>${p.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
        <button onClick={pay} disabled={paying} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:"#fff",color:"#000",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"center",gap:7,fontFamily:"'Sora',sans-serif",opacity:paying?.5:1,transition:"opacity .15s"}}>
          <span style={{fontSize:18}}></span>{paying?"Processing…":`Pay $${plan.price.toFixed(2)} with Apple Pay`}
        </button>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{flex:1,height:1,background:"var(--border)"}}/><span style={{fontSize:10,color:"var(--muted)"}}>or card</span><div style={{flex:1,height:1,background:"var(--border)"}}/></div>
        <button className="btn" onClick={pay} disabled={paying} style={{fontSize:13,padding:"12px"}}>{paying?"Processing…":`Pay $${plan.price.toFixed(2)} with Card →`}</button>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginTop:10,fontSize:10,color:"var(--muted)"}}><span>🔒</span><span>Square · Nonprofit rate · No account needed</span></div>
        <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",marginTop:7}}>💚 Payments go directly to Bradenton Gospel Tabernacle</div>
      </div>
    </div>
  );
}

function VoucherScreen({ onBack, onSuccess }) {
  const [code, setCode]   = useState("");
  const [err,  setErr]    = useState("");
  const [act,  setAct]    = useState(false);
  const [scan, setScan]   = useState(false);
  const vidRef  = useRef(null);
  const strmRef = useRef(null);
  const inpRef  = useRef(null);

  function stopCam(){ if(strmRef.current){strmRef.current.getTracks().forEach(t=>t.stop());strmRef.current=null;} setScan(false); }
  useEffect(()=>{ return ()=>stopCam(); },[]);

  function tryCode(c){
    const v=c.trim().toUpperCase();
    if(v.length<CODE_LENGTH) return;
    if(VALID_CODES[v]){ setAct(true); setTimeout(()=>{ setAct(false); onSuccess(VALID_CODES[v]); },900); }
    else setErr("Code not recognized. Double-check and try again.");
  }
  function onChange(val){
    const cl=val.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,CODE_LENGTH);
    setCode(cl); setErr("");
    if(cl.length===CODE_LENGTH) tryCode(cl);
  }
  async function startScan(){
    setScan(true);
    try{
      const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
      strmRef.current=s; if(vidRef.current) vidRef.current.srcObject=s;
      setTimeout(()=>{ stopCam(); const dc="CHURCH24"; setCode(dc); setAct(true); setTimeout(()=>{setAct(false);onSuccess(VALID_CODES[dc]);},900); },2500);
    }catch{ setScan(false); setErr("Camera unavailable — type your code instead."); }
  }

  return (
    <div className="wrap">
      <div className="card">
        <button onClick={onBack} style={{background:"none",border:"none",color:"var(--muted)",fontSize:13,cursor:"pointer",marginBottom:12,padding:0,fontFamily:"'Sora',sans-serif"}}>← Back</button>
        <div style={{fontSize:21,marginBottom:6}}>🏷️</div>
        <div style={{fontSize:19,fontWeight:700,marginBottom:4}}>Enter Your Code</div>
        <div style={{fontSize:13,color:"var(--muted)",marginBottom:14,lineHeight:1.6}}>Paste, type, or scan. Auto-activates on last character.</div>

        {act && <div style={{textAlign:"center",padding:"22px 0",animation:"fadeUp .2s ease"}}><div style={{fontSize:38,marginBottom:10}}>⚡</div><div style={{fontSize:17,fontWeight:700,color:"var(--accent)"}}>Activating…</div></div>}

        {!act && !scan && <>
          <div style={{position:"relative",marginBottom:8}}>
            <input ref={inpRef} value={code} onChange={e=>onChange(e.target.value)}
              onPaste={e=>{ e.preventDefault(); const p=e.clipboardData.getData("text").trim().toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,CODE_LENGTH); onChange(p); }}
              placeholder="CHURCH24" maxLength={CODE_LENGTH} autoCapitalize="characters" autoCorrect="off" spellCheck={false}
              style={{width:"100%",padding:"17px 14px",borderRadius:12,border:`2px solid ${err?"var(--danger)":"var(--border)"}`,background:"var(--surface)",color:"var(--text)",fontSize:24,fontFamily:"'DM Mono',monospace",fontWeight:700,textAlign:"center",letterSpacing:".12em",outline:"none",transition:"border-color .2s",boxSizing:"border-box"}}/>
            <div style={{position:"absolute",bottom:-15,left:0,right:0,display:"flex",justifyContent:"center",gap:4}}>
              {Array.from({length:CODE_LENGTH}).map((_,i)=>(
                <div key={i} style={{width:5,height:5,borderRadius:"50%",background:i<code.length?"var(--accent)":"var(--border)",transition:"background .1s"}}/>
              ))}
            </div>
          </div>
          {err && <div style={{fontSize:12,color:"var(--danger)",textAlign:"center",marginTop:18,marginBottom:4}}>⚠ {err}</div>}
          <div style={{display:"flex",gap:8,marginTop:20,marginBottom:14}}>
            <button onClick={async()=>{ try{const t=await navigator.clipboard.readText();onChange(t);}catch{inpRef.current?.focus();} }} style={{flex:1,padding:"10px 6px",borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>📋 Paste</button>
            <button onClick={startScan} style={{flex:1,padding:"10px 6px",borderRadius:10,border:"1px solid var(--accent)",background:"var(--sbg)",color:"var(--accent)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>📷 Scan QR</button>
          </div>
          <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:8,padding:"9px 12px",fontSize:11,color:"var(--muted)",lineHeight:1.6}}>
            <strong style={{color:"var(--text)"}}>Demo codes:</strong> CHURCH24 · BLESS724 · GRACE301
          </div>
        </>}

        {scan && !act && (
          <div style={{textAlign:"center"}}>
            <div style={{borderRadius:14,overflow:"hidden",border:"2px solid var(--accent)",marginBottom:12,position:"relative",background:"#000",aspectRatio:"1"}}>
              <video ref={vidRef} autoPlay playsInline muted style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:"55%",height:"55%",border:"3px solid var(--accent)",borderRadius:10,boxShadow:"0 0 0 9999px rgba(0,0,0,.45)"}}/>
              </div>
              <div style={{position:"absolute",bottom:12,left:0,right:0,fontSize:11,color:"#fff",textAlign:"center",fontWeight:600}}>Point camera at QR code</div>
            </div>
            <div style={{fontSize:11,color:"var(--muted)",marginBottom:10}}>Demo: auto-reads in 2.5 sec</div>
            <button onClick={stopCam} style={{padding:"8px 20px",borderRadius:8,border:"1px solid var(--border)",background:"transparent",color:"var(--muted)",cursor:"pointer",fontSize:12,fontFamily:"'Sora',sans-serif"}}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TENANT PORTAL ────────────────────────────────────────────────────────────
function TenantPortal({ events, posts }) {
  const DS = 4;
  const [secs,    setSecs]    = useState(DS);
  const [expired, setExpired] = useState(false);
  const [payM,    setPayM]    = useState(null);   // full-screen: voucher|venmo|card
  const [okPlan,  setOkPlan]  = useState(null);   // paid plan
  const [mOpen,   setMOpen]   = useState(false);
  const [mUnit,   setMUnit]   = useState("Unit 1");
  const [mCat,    setMCat]    = useState("general");
  const [mMsg,    setMMsg]    = useState("");
  const [mSent,   setMSent]   = useState(false);
  const { addMaint } = useContext(AppCtx);
  const tmr = useRef(null);

  // Timer starts immediately on mount
  useEffect(()=>{
    tmr.current = setInterval(()=>{
      setSecs(s=>{ if(s<=1){ clearInterval(tmr.current); setExpired(true); return 0; } return s-1; });
    },1000);
    return ()=>clearInterval(tmr.current);
  },[]);

  const mm=Math.floor(secs/60), ss=String(secs%60).padStart(2,"0");
  const pct=Math.min(100,((DS-secs)/DS)*100);
  const td=`${mm}:${ss}`;
  const tstate = expired?"exp":secs<5?"warn":"active";

  function reset(){ setPayM(null); }
  function submitMaint(){
    if(!mMsg.trim()) return;
    addMaint({unit:mUnit,category:mCat,message:mMsg.trim(),date:"Just now",status:"new"});
    setMSent(true); setMMsg("");
    setTimeout(()=>{ setMOpen(false); setMSent(false); },2500);
  }

  // Full-screen payment sub-screens (need focused input)
  if(payM==="voucher") return <VoucherScreen onBack={reset} onSuccess={plan=>{ setOkPlan(PLANS.find(p=>p.id===plan)||PLANS[0]); setExpired(false); setSecs(DS*10); reset(); }}/>;
  if(payM==="venmo")   return <VenmoScreen   onBack={reset} onCodeEntry={()=>setPayM("voucher")}/>;
  if(payM==="card")    return <CardScreen     onBack={reset} plans={PLANS} onSuccess={plan=>{ setOkPlan(plan); setExpired(false); setSecs(DS*10); reset(); }}/>;

  // ── Single always-visible page ──
  return (
    <div className="wrap" style={{alignItems:"flex-start"}}>
      <div className="card">
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <Logo size={38}/>
          <div><div style={{fontSize:14,fontWeight:700}}>Bradenton Gospel Tabernacle</div><div style={{fontSize:11,color:"var(--muted)"}}>Resident WiFi Portal</div></div>
        </div>
        <Scripture/>

        {/* ── TIMER BOX — transforms in place ── */}
        <div className="tblock" style={{border:`1px solid ${expired&&!okPlan?"var(--danger)":okPlan?"var(--sbd)":"var(--border)"}`,background:expired&&!okPlan?"#1a0505":okPlan?"var(--sbg)":"var(--surface)",transition:"all .4s"}}>

          {/* State: Active / ticking */}
          {!expired && !okPlan && <>
            <div className="tlbl">Your Free Session — Connected Automatically</div>
            <div className="trow">
              <div className={`tval mono ${tstate}`}>{td}</div>
              <div className={`tbadge ${tstate}`}>{tstate==="warn"?"Ending Soon":"Connected ✓"}</div>
            </div>
            <div className="pbar"><div className={`pfill ${tstate}`} style={{width:`${pct}%`}}/></div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:8,textAlign:"center"}}>Close this page and browse freely — payment screen will appear here when time runs out.</div>
          </>}

          {/* State: Paid — show session info */}
          {okPlan && <>
            <div className="tlbl">Paid Session Active</div>
            <div className="trow">
              <div className="tval mono active">✓ Online</div>
              <div className="tbadge active">Paid · {okPlan.label}</div>
            </div>
            <div className="pbar"><div className="pfill" style={{width:"100%"}}/></div>
            <div style={{fontSize:11,color:"var(--stx)",marginTop:8,textAlign:"center"}}>
              {okPlan.id==="day"?"24 hours":okPlan.id==="week"?"7 days":"30 days"} of WiFi active. 💚 Thank you for supporting BGT.
            </div>
            <button onClick={()=>{setOkPlan(null);setExpired(false);setSecs(DS);}} style={{marginTop:10,width:"100%",padding:"8px",borderRadius:8,border:"1px solid var(--sbd)",background:"transparent",color:"var(--stx)",fontSize:11,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>↩ Restart Demo</button>
          </>}

          {/* State: Expired — payment picker inline */}
          {expired && !okPlan && <>
            <div className="tlbl" style={{color:"var(--danger)"}}>⏰ Your free time is up — choose how to continue</div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
              {[
                {m:"voucher",icon:"🏷️",title:"Voucher Code",     sub:"Got a paper code? Enter it.",       bd:"var(--accent)", bg:"var(--sbg)",    col:"var(--accent)"},
                {m:"venmo",  icon:"📱",title:"Venmo / Cash App", sub:"Send any amount — auto code.",      bd:"var(--border)", bg:"var(--surface)",col:"var(--text)"},
                {m:"card",   icon:"💳",title:"Apple Pay / Card", sub:"Instant access via Square.",        bd:"var(--border)", bg:"var(--surface)",col:"var(--text)"},
              ].map(b=>(
                <button key={b.m} onClick={()=>setPayM(b.m)} style={{background:b.bg,border:`2px solid ${b.bd}`,borderRadius:11,padding:"12px 14px",cursor:"pointer",textAlign:"left",width:"100%",display:"flex",alignItems:"center",gap:12,transition:"all .15s"}}>
                  <span style={{fontSize:26,flexShrink:0}}>{b.icon}</span>
                  <div><div style={{fontSize:14,fontWeight:700,color:b.col,fontFamily:"'Sora',sans-serif"}}>{b.title}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:1,fontFamily:"'Sora',sans-serif"}}>{b.sub}</div></div>
                </button>
              ))}
            </div>
            <div style={{fontSize:10,color:"var(--muted)",textAlign:"center",marginTop:10}}>💚 Payments go directly to Bradenton Gospel Tabernacle · Call 555-123-4567 for help</div>
          </>}
        </div>

        {/* Plans preview — only when active */}
        {!expired && !okPlan && (
          <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:"11px 13px",marginBottom:12}}>
            <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Need more time? Plans start at</div>
            <div style={{display:"flex",gap:7}}>
              {PLANS.map(p=>(
                <div key={p.id} style={{flex:1,textAlign:"center",background:"var(--bg)",borderRadius:8,padding:"8px 4px"}}>
                  <div style={{fontSize:17,fontWeight:700,color:"var(--accent)",fontFamily:"'DM Mono',monospace"}}>${p.price.toFixed(2)}</div>
                  <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{p.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Church events — always visible */}
        {events.length>0 && <>
          <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>📅 Church Events & News</div>
          <EventsList events={events}/>
        </>}

        {/* Community board — always visible */}
        {posts.length>0 && <>
          <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",margin:"12px 0 8px"}}>🏠 Community Board</div>
          {posts.slice(0,3).map(p=>{
            const cat=TENANT_CATS.find(c=>c.id===p.category);
            return (
              <div className="post" key={p.id} style={{borderLeftColor:cat?.color||"var(--accent)"}}>
                <div className="post-cat" style={{color:cat?.color||"var(--accent)"}}>{cat?.label||p.category}</div>
                <div className="post-title">{p.title}</div>
                <div className="post-body">{p.body}</div>
                <div className="post-date">{p.date}</div>
              </div>
            );
          })}
        </>}

        {/* Maintenance — always visible */}
        {!mOpen && !mSent && (
          <button className="btn warn-btn" onClick={()=>setMOpen(true)} style={{fontSize:12,padding:"10px",marginTop:8,marginBottom:6}}>🔧 Submit Maintenance Request</button>
        )}
        {mSent && <div style={{background:"var(--sbg)",border:"1px solid var(--sbd)",borderRadius:10,padding:"9px 13px",marginBottom:6,fontSize:12,color:"var(--accent)",textAlign:"center",fontWeight:600}}>✓ Request submitted! We will be in touch soon.</div>}
        {mOpen && !mSent && (
          <div className="aform" style={{marginTop:8,marginBottom:6}}>
            <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>🔧 Maintenance Request</div>
            <div style={{display:"flex",gap:7,marginBottom:8}}>
              <select className="fsel" value={mUnit} onChange={e=>setMUnit(e.target.value)} style={{flex:1}}>
                {UNITS.map(u=><option key={u}>{u}</option>)}
              </select>
              <select className="fsel" value={mCat} onChange={e=>setMCat(e.target.value)}>
                {MAINT_CATS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <textarea className="fta" placeholder="Describe the issue…" value={mMsg} onChange={e=>setMMsg(e.target.value)} style={{marginBottom:8}}/>
            <div style={{display:"flex",gap:7}}>
              <button className="btn" onClick={submitMaint} style={{fontSize:12,padding:"9px"}}>Send Request</button>
              <button className="btn sec" onClick={()=>setMOpen(false)} style={{fontSize:12,padding:"9px",marginTop:0}}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GUEST PORTAL ─────────────────────────────────────────────────────────────
function GuestPortal({ events }) {
  const DS = 4;
  const [secs,    setSecs]    = useState(DS);
  const [expired, setExpired] = useState(false);
  const [payM,    setPayM]    = useState(null);
  const [offUsed, setOffUsed] = useState(false);
  const [okMsg,   setOkMsg]   = useState(""); // "donation"|"offering"|""
  const tmr = useRef(null);

  // Timer starts immediately on mount
  useEffect(()=>{
    tmr.current = setInterval(()=>{
      setSecs(s=>{ if(s<=1){ clearInterval(tmr.current); setExpired(true); return 0; } return s-1; });
    },1000);
    return ()=>clearInterval(tmr.current);
  },[]);

  const mm=Math.floor(secs/60), ss=String(secs%60).padStart(2,"0"), td=`${mm}:${ss}`;
  const pct=Math.min(100,((DS-secs)/DS)*100);
  const tstate=expired?"exp":secs<5?"warn":"active";
  function reset(){ setPayM(null); }

  // Full-screen payment sub-screens
  if(payM==="venmo")   return <VenmoScreen  onBack={reset} onCodeEntry={()=>setPayM("voucher")}/>;
  if(payM==="voucher") return <VoucherScreen onBack={reset} onSuccess={()=>{ setOkMsg("donation"); setExpired(false); setSecs(DS*10); reset(); }}/>;
  if(payM==="card")    return <CardScreen    onBack={reset} plans={DONATION_PLANS} onSuccess={()=>{ setOkMsg("donation"); setExpired(false); setSecs(DS*10); reset(); }}/>;

  // ── Single always-visible page ──
  return (
    <div className="wrap" style={{alignItems:"flex-start"}}>
      <div className="card">
        <div style={{textAlign:"center",marginBottom:14}}>
          <Logo size={52}/>
          <div style={{fontSize:16,fontWeight:700,marginTop:8}}>Bradenton Gospel Tabernacle</div>
          <div style={{fontSize:12,color:"var(--muted)",marginTop:3}}>Welcome, friend — we're glad you're here. 🕊️</div>
        </div>
        <Scripture/>

        {/* ── TIMER BOX — transforms in place ── */}
        <div className="tblock" style={{border:`1px solid ${expired&&!okMsg?"var(--danger)":okMsg?"var(--sbd)":"var(--border)"}`,background:expired&&!okMsg?"#1a0505":okMsg?"var(--sbg)":"var(--surface)",transition:"all .4s"}}>

          {/* Active */}
          {!expired && !okMsg && <>
            <div className="tlbl">Your Free Guest Session — Connected</div>
            <div className="trow">
              <div className={`tval mono ${tstate}`}>{td}</div>
              <div className={`tbadge ${tstate}`}>{tstate==="warn"?"Ending Soon":"Connected ✓"}</div>
            </div>
            <div className="pbar"><div className={`pfill ${tstate}`} style={{width:`${pct}%`}}/></div>
            <div style={{fontSize:11,color:"var(--muted)",marginTop:8,textAlign:"center"}}>You're online — close this page and browse freely.</div>
          </>}

          {/* Paid / offering extended */}
          {okMsg && <>
            <div className="tlbl">{okMsg==="offering"?"🙏 Offering Extension":"💚 Thank You for Giving!"}</div>
            <div className="trow">
              <div className="tval mono active">{okMsg==="offering"?"+30 min":"✓ Online"}</div>
              <div className="tbadge active">{okMsg==="offering"?"Extended":"Gave"}</div>
            </div>
            <div className="pbar"><div className="pfill" style={{width:"100%"}}/></div>
            <div style={{fontSize:11,color:"var(--stx)",marginTop:8,textAlign:"center"}}>
              {okMsg==="offering"
                ? "Your WiFi is extended. We look forward to seeing you at the offering 🙏"
                : "Your gift goes directly to BGT. God bless you! 💚"}
            </div>
            <button onClick={()=>{setOkMsg("");setExpired(false);setSecs(DS);}} style={{marginTop:10,width:"100%",padding:"8px",borderRadius:8,border:"1px solid var(--sbd)",background:"transparent",color:"var(--stx)",fontSize:11,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>↩ Restart Demo</button>
          </>}

          {/* Expired — inline giving options */}
          {expired && !okMsg && <>
            <div className="tlbl" style={{color:"var(--danger)"}}>⏰ Your free session has ended</div>
            <div style={{fontSize:12,color:"var(--muted)",marginBottom:10,lineHeight:1.5}}>
              Blessed to have you with us. If you'd like to give back to the church, any amount is appreciated. 🙏
            </div>

            {/* Donation amounts */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:10}}>
              {[{l:"$5"},{l:"$10"},{l:"$25"},{l:"Other"}].map(d=>(
                <button key={d.l} onClick={()=>setPayM("card")} style={{padding:"9px 4px",borderRadius:9,border:"1px solid var(--sbd)",background:"var(--sbg)",color:"var(--stx)",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif",textAlign:"center"}}>
                  {d.l}
                </button>
              ))}
            </div>

            {/* Payment methods */}
            <div style={{display:"flex",gap:6,marginBottom:10}}>
              <button onClick={()=>setPayM("venmo")} style={{flex:1,padding:"9px 4px",borderRadius:9,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>📱 Venmo / Cash App</button>
              <button onClick={()=>setPayM("card")}  style={{flex:1,padding:"9px 4px",borderRadius:9,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>💳 Card / Apple Pay</button>
            </div>

            {/* Give at offering */}
            <button className="offer-btn" disabled={offUsed} onClick={()=>{
              if(offUsed) return;
              setOffUsed(true); setOkMsg("offering"); setExpired(false); setSecs(DS*10);
            }} style={{marginBottom:6}}>
              {offUsed ? "✓ Already used today" : "🙏 I'll give at the offering → +30 min free"}
            </button>
            <div style={{fontSize:10,color:"var(--muted)",textAlign:"center"}}>💚 All gifts go directly to Bradenton Gospel Tabernacle</div>
          </>}
        </div>

        {/* Soft donation — visible while timer active */}
        {!expired && !okMsg && (
          <div style={{background:"var(--surface)",border:"1px solid var(--sbd)",borderRadius:12,padding:"12px 13px",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:"var(--accent)",marginBottom:3}}>💚 Feel Led to Give?</div>
            <div style={{fontSize:11,color:"var(--muted)",marginBottom:9,lineHeight:1.5}}>Your generosity helps us serve this community.</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:7}}>
              {["$5","$10","$25","Other"].map(l=>(
                <button key={l} onClick={()=>setPayM("card")} style={{padding:"8px 4px",borderRadius:8,border:"1px solid var(--sbd)",background:"var(--sbg)",color:"var(--stx)",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif",textAlign:"center"}}>{l}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:6}}>
              <button onClick={()=>setPayM("venmo")} style={{flex:1,padding:"7px 4px",borderRadius:8,border:"1px solid var(--border)",background:"transparent",color:"var(--muted)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>📱 Venmo / Cash App</button>
              <button onClick={()=>setPayM("card")}  style={{flex:1,padding:"7px 4px",borderRadius:8,border:"1px solid var(--border)",background:"transparent",color:"var(--muted)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>💳 Card / Apple Pay</button>
            </div>
          </div>
        )}

        {/* Events — always visible */}
        {events.length>0 && <>
          <div style={{fontSize:10,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>📅 This Week at BGT</div>
          <EventsList events={events}/>
        </>}

        {/* Visitor info — always visible */}
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:12,padding:"11px 13px",marginTop:12}}>
          <div style={{fontSize:11,fontWeight:700,marginBottom:8,color:"var(--accent)"}}>ℹ️ Visitor Info</div>
          {[
            {icon:"📍",text:"1234 Church Street, Bradenton, FL 34205"},
            {icon:"📞",text:"(555) 123-4567"},
            {icon:"🌐",text:"www.bgt-church.org"},
            {icon:"🅿️",text:"Free parking — main lot & side street"},
          ].map((x,i)=>(
            <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:i<3?5:0}}>
              <span style={{fontSize:13,flexShrink:0,marginTop:1}}>{x.icon}</span>
              <span style={{fontSize:12,color:"var(--muted)",lineHeight:1.4}}>{x.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [pin,setPin]=useState(""), [err,setErr]=useState(false), [shake,setShake]=useState(false);
  function attempt(){ if(pin==="1234"){onLogin();}else{setErr(true);setShake(true);setPin("");setTimeout(()=>setShake(false),500);} }
  return (
    <div className="wrap" style={{background:"radial-gradient(ellipse 60% 50% at 50% 0%,#0a1020 0%,var(--bg) 70%)"}}>
      <div className="card" style={{maxWidth:340}}>
        <div style={{textAlign:"center",marginBottom:14}}><Logo size={44}/></div>
        <div style={{fontSize:19,fontWeight:700,marginBottom:4,textAlign:"center"}}>Admin Access</div>
        <div style={{fontSize:12,color:"var(--muted)",marginBottom:18,textAlign:"center"}}>Enter your PIN to manage the network from anywhere.</div>
        <div style={{background:"var(--surface)",border:`1px solid ${err?"var(--danger)":"var(--border)"}`,borderRadius:10,padding:"13px",marginBottom:10,textAlign:"center",letterSpacing:".3em",fontSize:24,fontFamily:"'DM Mono',monospace",color:err?"var(--danger)":"var(--text)",animation:shake?"shake .4s ease":"none"}}>
          {pin?"•".repeat(pin.length):<span style={{color:"var(--muted)",fontSize:13,letterSpacing:"normal"}}>Enter PIN</span>}
        </div>
        {err&&<div style={{fontSize:11,color:"var(--danger)",textAlign:"center",marginBottom:8}}>Incorrect PIN — try again</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
          {[1,2,3,4,5,6,7,8,9,"⌫",0,"→"].map(k=>(
            <button key={k} onClick={()=>{ if(k==="⌫"){setPin(p=>p.slice(0,-1));setErr(false);}else if(k==="→")attempt();else if(pin.length<6){setPin(p=>p+k);setErr(false);}}}
              style={{padding:"13px 0",borderRadius:10,border:"1px solid var(--border)",background:k==="→"?"var(--accent)":"var(--surface)",color:k==="→"?"#fff":"var(--text)",fontSize:k==="→"||k==="⌫"?17:20,fontWeight:700,cursor:"pointer",fontFamily:"'DM Mono',monospace",transition:"all .1s"}}>
              {k}
            </button>
          ))}
        </div>
        <div style={{fontSize:10,color:"var(--muted)",textAlign:"center"}}>Demo PIN: 1234</div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function Admin({ events, setEvents, posts, setPosts, maint, setMaint }) {
  const [users,  setUsers]  = useState(INITIAL_USERS);
  const [toast,  setToast]  = useState(null);
  const [filter, setFilter] = useState("all");
  const [tab,    setTab]    = useState("sessions");

  // Voucher
  const [vcodes, setVcodes] = useState([]);
  const [vtype,  setVtype]  = useState("day");
  const [vqty,   setVqty]   = useState(5);
  const VP = { day:{label:"Day Pass",price:"$1.00"}, week:{label:"Week Pass",price:"$5.00"}, month:{label:"Monthly",price:"$15.00"} };
  function mkCode(t){ const w={day:["BLESS","GRACE","FAITH","PEACE"],week:["GOSPEL","PRAYER"],month:["ETERNAL","COVENANT"]}; return w[t][Math.floor(Math.random()*w[t].length)]+Math.floor(10+Math.random()*90); }
  function genBatch(){ const c=Array.from({length:vqty},()=>({code:mkCode(vtype),type:vtype,used:false,date:new Date().toLocaleDateString()})); setVcodes(x=>[...c,...x]); toast2(`✓ ${vqty} codes generated`); }

  // Events form
  const EVT_BLANK = {title:"",date:"",time:"",desc:"",category:"service"};
  const [evtF, setEvtF]   = useState(EVT_BLANK);
  const [evtE, setEvtE]   = useState(null);

  // Board form
  const POST_BLANK = {title:"",body:"",category:"announcement"};
  const [postF,setPostF]  = useState(POST_BLANK);
  const [postE,setPostE]  = useState(null);

  const active  = users.filter(u=>u.status==="active").length;
  const expired = users.filter(u=>u.status==="expired").length;
  const paid    = users.filter(u=>u.status==="paid").length;
  const revenue = users.filter(u=>u.paid).length*5;
  const newMaint= maint.filter(r=>r.status==="new").length;
  const filtered= filter==="all"?users:users.filter(u=>u.status===filter);

  function toast2(m){ setToast(m); setTimeout(()=>setToast(null),2200); }
  function grantTime(id){ setUsers(u=>u.map(x=>x.id===id?{...x,minutesUsed:0,status:"active"}:x)); toast2("✓ 60 minutes granted"); }
  function kickUser(id){  setUsers(u=>u.map(x=>x.id===id?{...x,status:"expired",minutesUsed:60}:x)); toast2("User disconnected"); }

  const TABS = [
    { id:"sessions", lbl:"📊 Sessions" },
    { id:"vouchers", lbl:"🏷️ Vouchers" },
    { id:"events",   lbl:"📋 Church & Events" },
    { id:"board",    lbl:"🏠 Tenant Board" },
    { id:"maint",    lbl:`🔧 Maintenance${newMaint>0?` (${newMaint})`:""}`},
    { id:"map",      lbl:"🗺️ Property Map" },
  ];

  return (
    <div className="admin">
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
        <Logo size={30}/>
        <div><div style={{fontSize:19,fontWeight:700}}>Admin Dashboard</div><div style={{fontSize:12,color:"var(--muted)",fontFamily:"'DM Mono',monospace"}}>Bradenton Gospel Tabernacle</div></div>
      </div>

      <div className="stats">
        <div className="stat"><div className="slbl">Active</div><div className="sval g">{active}</div></div>
        <div className="stat"><div className="slbl">Paid</div><div className="sval b">{paid}</div></div>
        <div className="stat"><div className="slbl">Expired</div><div className="sval r">{expired}</div></div>
        <div className="stat"><div className="slbl">Revenue</div><div className="sval o">${revenue}</div></div>
      </div>

      <div className="tabs">
        {TABS.map(t=>(
          <button key={t.id} className="tab" onClick={()=>setTab(t.id)}
            style={{background:tab===t.id?"var(--accent)":"transparent",color:tab===t.id?"#fff":"var(--muted)",borderColor:tab===t.id?"var(--accent)":"var(--border)"}}>
            {t.lbl}
          </button>
        ))}
      </div>

      {/* ── SESSIONS ── */}
      {tab==="sessions" && <>
        <div className="tabs" style={{marginBottom:12}}>
          {["all","active","paid","expired"].map(f=>(
            <button key={f} className="tab" onClick={()=>setFilter(f)}
              style={{background:filter===f?"var(--accent)":"transparent",color:filter===f?"#fff":"var(--muted)",borderColor:filter===f?"var(--accent)":"var(--border)",textTransform:"capitalize"}}>
              {f==="all"?`All (${users.length})`:`${f[0].toUpperCase()+f.slice(1)} (${users.filter(u=>u.status===f).length})`}
            </button>
          ))}
        </div>
        <div className="sec-lbl">Users — {filtered.length} shown</div>
        <div className="ucards">
          {filtered.map(u=>{
            const pct=Math.min(100,(u.minutesUsed/60)*100);
            return (
              <div className="uc" key={u.id}>
                <div className="uc-top">
                  <div><div className="uc-name">{u.name}</div><div className="uc-unit">{u.unit}</div></div>
                  <span className={`spill sp-${u.status}`}>{u.status==="paid"?`Paid · ${u.plan}`:u.status[0].toUpperCase()+u.status.slice(1)}</span>
                </div>
                <div className="ugrid">
                  <div><div className="ufl">IP</div><div className="ufv mono">{u.ip}</div></div>
                  <div><div className="ufl">Data</div><div className="ufv mono">{u.dataUsed}</div></div>
                  <div><div className="ufl">MAC</div><div className="ufv mono">{u.mac}</div></div>
                  <div><div className="ufl">Last Seen</div><div className="ufv">{u.lastSeen}</div></div>
                </div>
                <div className="ubar-row">
                  <div className="ubar-top"><span className="ubar-lbl">Free Daily (60 min)</span><span className="ubar-val">{u.minutesUsed}/60</span></div>
                  <div className="ubar"><div className={`ufill ${u.minutesUsed>=60?"full":""}`} style={{width:`${pct}%`}}/></div>
                </div>
                {u.paid&&u.paidHoursTotal&&(()=>{
                  const hL=u.paidHoursTotal-u.paidHoursUsed, pp=Math.min(100,(u.paidHoursUsed/u.paidHoursTotal)*100);
                  const dL=Math.floor(hL/24),hR=hL%24, rem=dL>0?`${dL}d ${hR}h left`:`${hL}h left`;
                  return (
                    <div className="ubar-row">
                      <div className="ubar-top"><span className="ubar-lbl" style={{color:"var(--accent2)"}}>{u.plan}</span><span className="ubar-val" style={{color:"var(--accent2)"}}>{rem}</span></div>
                      <div className="ubar"><div className="ufill" style={{width:`${100-pp}%`,background:hL<6?"var(--warn)":"var(--accent2)"}}/></div>
                    </div>
                  );
                })()}
                <div className="uactions">
                  <button className="abtn abtn-g" onClick={()=>grantTime(u.id)}>+ Grant 60 min</button>
                  <button className="abtn abtn-r" onClick={()=>kickUser(u.id)}>Disconnect</button>
                </div>
              </div>
            );
          })}
        </div>
      </>}

      {/* ── VOUCHERS ── */}
      {tab==="vouchers" && <>
        <div className="aform">
          <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>Generate Voucher Codes</div>
          <div style={{fontSize:11,color:"var(--muted)",marginBottom:12}}>Print and sell at the church office. Each code works once.</div>
          <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap"}}>
            {Object.entries(VP).map(([id,p])=>(
              <button key={id} className="tab" onClick={()=>setVtype(id)} style={{flex:1,minWidth:80,padding:"10px 6px",textAlign:"center",border:"2px solid",background:vtype===id?"var(--sbg)":"var(--surface)",color:vtype===id?"var(--accent)":"var(--muted)",borderColor:vtype===id?"var(--accent)":"var(--border)"}}>
                <div style={{fontSize:11,fontWeight:700}}>{p.label}</div><div style={{fontSize:15,marginTop:2}}>{p.price}</div>
              </button>
            ))}
          </div>
          <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:12}}>
            <span style={{fontSize:11,color:"var(--muted)"}}>Qty:</span>
            {[1,5,10,20].map(n=>(
              <button key={n} className="tab" onClick={()=>setVqty(n)} style={{padding:"5px 12px",background:vqty===n?"var(--accent)":"transparent",color:vqty===n?"#fff":"var(--muted)",borderColor:vqty===n?"var(--accent)":"var(--border)"}}>{n}</button>
            ))}
          </div>
          <button className="abtn abtn-g" onClick={genBatch} style={{width:"100%",padding:"10px",fontSize:12,borderRadius:9}}>
            Generate {vqty} × {VP[vtype].label} Codes ({VP[vtype].price} each)
          </button>
        </div>
        {vcodes.length>0&&<>
          <div className="sec-lbl">Generated — Print & Sell</div>
          {vcodes.map((c,i)=>(
            <div key={i} style={{background:"var(--card)",border:`1px solid ${c.used?"var(--border)":"var(--sbd)"}`,borderRadius:10,padding:"11px 13px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:16,fontWeight:700,color:c.used?"var(--muted)":"var(--accent)",letterSpacing:".08em",textDecoration:c.used?"line-through":"none"}}>{c.code}</div>
                <div style={{fontSize:10,color:"var(--muted)",marginTop:2}}>{VP[c.type].label} · {VP[c.type].price} · {c.date}</div>
              </div>
              <span style={{fontSize:9,fontWeight:700,padding:"3px 9px",borderRadius:20,background:c.used?"#1a0b0b":"var(--sbg)",color:c.used?"var(--danger)":"var(--accent)",border:`1px solid ${c.used?"#3a1e1e":"var(--sbd)"}`}}>{c.used?"REDEEMED":"ACTIVE"}</span>
            </div>
          ))}
          <div style={{fontSize:10,color:"var(--muted)",textAlign:"center",marginTop:6}}>Status updates automatically when a code is redeemed.</div>
        </>}
        {vcodes.length===0&&<div style={{textAlign:"center",padding:"26px 0",color:"var(--muted)",fontSize:13}}>No codes yet. Choose a plan and tap Generate.</div>}
      </>}

      {/* ── CHURCH EVENTS ── */}
      {tab==="events" && <>
        <div className="aform">
          <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>{evtE?"✏️ Edit Event":"➕ Add Event"}</div>
          <div style={{display:"flex",gap:7,marginBottom:8,flexWrap:"wrap"}}>
            <input className="finput" placeholder="Event title" value={evtE?evtE.title:evtF.title} onChange={e=>evtE?setEvtE({...evtE,title:e.target.value}):setEvtF({...evtF,title:e.target.value})}/>
            <select className="fsel" value={evtE?evtE.category:evtF.category} onChange={e=>evtE?setEvtE({...evtE,category:e.target.value}):setEvtF({...evtF,category:e.target.value})}>
              {["service","study","event","special","youth"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{display:"flex",gap:7,marginBottom:8}}>
            <input className="finput" placeholder="Date (e.g. Every Sunday)" value={evtE?evtE.date:evtF.date} onChange={e=>evtE?setEvtE({...evtE,date:e.target.value}):setEvtF({...evtF,date:e.target.value})}/>
            <input className="finput" placeholder="Time" value={evtE?evtE.time:evtF.time} onChange={e=>evtE?setEvtE({...evtE,time:e.target.value}):setEvtF({...evtF,time:e.target.value})} style={{maxWidth:110}}/>
          </div>
          <textarea className="fta" placeholder="Description (optional)" value={evtE?evtE.desc:evtF.desc} onChange={e=>evtE?setEvtE({...evtE,desc:e.target.value}):setEvtF({...evtF,desc:e.target.value})} style={{marginBottom:9}}/>
          <div style={{display:"flex",gap:7}}>
            <button className="abtn abtn-g" style={{padding:"9px",fontSize:12,borderRadius:8}} onClick={()=>{
              if(evtE){ setEvents(ev=>ev.map(e=>e.id===evtE.id?evtE:e)); setEvtE(null); toast2("✓ Event updated"); }
              else if(evtF.title){ setEvents(ev=>[...ev,{...evtF,id:Date.now()}]); setEvtF(EVT_BLANK); toast2("✓ Event added"); }
            }}>{evtE?"Save Changes":"Add Event"}</button>
            {evtE&&<button className="abtn abtn-r" style={{flex:"unset",padding:"9px 14px",fontSize:12,borderRadius:8}} onClick={()=>setEvtE(null)}>Cancel</button>}
          </div>
        </div>
        <div className="sec-lbl">Events — shows on Guest & Resident pages ({events.length})</div>
        {events.map(e=>(
          <div className="evt" key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:9,color:EVT_COLOR[e.category]||"#64748b",fontWeight:700,marginBottom:3}}>{e.category} · {e.date} · {e.time}</div>
              <div className="evt-title">{e.title}</div>
              {e.desc&&<div className="evt-desc">{e.desc}</div>}
            </div>
            <div style={{display:"flex",gap:5,marginLeft:8,flexShrink:0}}>
              <button className="abtn abtn-g" style={{flex:"unset",padding:"4px 9px",fontSize:9}} onClick={()=>setEvtE({...e})}>Edit</button>
              <button className="abtn abtn-r" style={{flex:"unset",padding:"4px 9px",fontSize:9}} onClick={()=>{ setEvents(ev=>ev.filter(x=>x.id!==e.id)); toast2("Event removed"); }}>Del</button>
            </div>
          </div>
        ))}
        {events.length===0&&<div style={{textAlign:"center",padding:"22px 0",color:"var(--muted)",fontSize:13}}>No events. Add one above.</div>}
      </>}

      {/* ── TENANT BOARD ── */}
      {tab==="board" && <>
        <div className="aform">
          <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>{postE?"✏️ Edit Post":"➕ Add Post"}</div>
          <div style={{display:"flex",gap:7,marginBottom:8,flexWrap:"wrap"}}>
            <input className="finput" placeholder="Post title" value={postE?postE.title:postF.title} onChange={e=>postE?setPostE({...postE,title:e.target.value}):setPostF({...postF,title:e.target.value})}/>
            <select className="fsel" value={postE?postE.category:postF.category} onChange={e=>postE?setPostE({...postE,category:e.target.value}):setPostF({...postF,category:e.target.value})}>
              {TENANT_CATS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <textarea className="fta" placeholder="Post content…" value={postE?postE.body:postF.body} onChange={e=>postE?setPostE({...postE,body:e.target.value}):setPostF({...postF,body:e.target.value})} style={{marginBottom:9}}/>
          <div style={{display:"flex",gap:7}}>
            <button className="abtn abtn-g" style={{padding:"9px",fontSize:12,borderRadius:8}} onClick={()=>{
              if(postE){ setPosts(p=>p.map(x=>x.id===postE.id?postE:x)); setPostE(null); toast2("✓ Post updated"); }
              else if(postF.title&&postF.body){ setPosts(p=>[{...postF,id:Date.now(),date:"Today"},...p]); setPostF(POST_BLANK); toast2("✓ Post added"); }
            }}>{postE?"Save Changes":"Post to Board"}</button>
            {postE&&<button className="abtn abtn-r" style={{flex:"unset",padding:"9px 14px",fontSize:12,borderRadius:8}} onClick={()=>setPostE(null)}>Cancel</button>}
          </div>
        </div>
        <div className="sec-lbl">Community Board — tenant-only ({posts.length} posts)</div>
        {posts.map(p=>{
          const cat=TENANT_CATS.find(c=>c.id===p.category);
          return (
            <div className="post" key={p.id} style={{borderLeftColor:cat?.color||"var(--accent)",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{flex:1}}>
                <div className="post-cat" style={{color:cat?.color||"var(--accent)"}}>{cat?.label||p.category} · {p.date}</div>
                <div className="post-title">{p.title}</div>
                <div className="post-body">{p.body}</div>
              </div>
              <div style={{display:"flex",gap:5,marginLeft:8,flexShrink:0}}>
                <button className="abtn abtn-g" style={{flex:"unset",padding:"4px 9px",fontSize:9}} onClick={()=>setPostE({...p})}>Edit</button>
                <button className="abtn abtn-r" style={{flex:"unset",padding:"4px 9px",fontSize:9}} onClick={()=>{ setPosts(ps=>ps.filter(x=>x.id!==p.id)); toast2("Post removed"); }}>Del</button>
              </div>
            </div>
          );
        })}
        {posts.length===0&&<div style={{textAlign:"center",padding:"22px 0",color:"var(--muted)",fontSize:13}}>No posts. Add one above.</div>}
      </>}

      {/* ── MAINTENANCE ── */}
      {tab==="maint" && <>
        <div className="sec-lbl">Maintenance Requests — {maint.length} total · {newMaint} new</div>
        {maint.length===0&&<div style={{textAlign:"center",padding:"26px 0",color:"var(--muted)",fontSize:13}}>No maintenance requests yet.</div>}
        {maint.map((r,i)=>(
          <div className="mcard" key={r.id||i}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div><div style={{fontSize:13,fontWeight:700}}>{r.unit}</div><div style={{fontSize:11,color:"var(--muted)",marginTop:1,textTransform:"capitalize"}}>{r.category} · {r.date}</div></div>
              <span className={`mst mst-${r.status}`}>{r.status.replace("_"," ")}</span>
            </div>
            <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6,marginBottom:10}}>{r.message}</div>
            <div style={{display:"flex",gap:6}}>
              {r.status!=="in_progress"&&<button className="abtn" style={{background:"#fff7ed",color:"var(--warn)",border:"1px solid #fed7aa",padding:"6px 0",fontSize:10}} onClick={()=>setMaint(rs=>rs.map((x,j)=>j===i?{...x,status:"in_progress"}:x))}>In Progress</button>}
              {r.status!=="resolved"&&<button className="abtn abtn-g" style={{padding:"6px 0",fontSize:10}} onClick={()=>setMaint(rs=>rs.map((x,j)=>j===i?{...x,status:"resolved"}:x))}>Mark Resolved</button>}
              <button className="abtn abtn-r" style={{flex:"unset",padding:"6px 12px",fontSize:10}} onClick={()=>setMaint(rs=>rs.filter((_,j)=>j!==i))}>Remove</button>
            </div>
          </div>
        ))}
      </>}

      {/* ── PROPERTY MAP ── */}
      {tab==="map" && <PropertyMap users={users} maint={maint} setMaint={setMaint} toast2={toast2}/>}

      {toast&&<div className="toast">{toast}</div>}
    </div>
  );
}

// ─── PROPERTY MAP ─────────────────────────────────────────────────────────────
const CAMERAS = [
  { id:"cam1", label:"Front Entrance",  zone:"North",  x:310, y:58,  status:"online"  },
  { id:"cam2", label:"Parking Lot",     zone:"East",   x:565, y:185, status:"online"  },
  { id:"cam3", label:"Church Rear",     zone:"West",   x:148, y:330, status:"online"  },
  { id:"cam4", label:"13th St Gate",    zone:"Center", x:408, y:295, status:"offline" },
  { id:"cam5", label:"School Entry",    zone:"Center", x:298, y:148, status:"online"  },
  { id:"cam6", label:"South Perimeter", zone:"South",  x:460, y:475, status:"online"  },
];

const BUILDINGS = [
  { id:"blockA", label:"Block A", sublabel:"Residential West", x:38,  y:105, w:58,  h:370,
    units:[{id:1,label:"U1",rx:67,ry:130},{id:2,label:"U2",rx:67,ry:175},{id:3,label:"U3",rx:67,ry:220},
           {id:4,label:"U4",rx:67,ry:265},{id:5,label:"U5",rx:67,ry:310},{id:6,label:"U6",rx:67,ry:355},
           {id:7,label:"U7",rx:67,ry:400},{id:8,label:"U8",rx:67,ry:445}] },
  { id:"blockB", label:"Block B", sublabel:"Residential East", x:616, y:105, w:58,  h:370,
    units:[{id:9,label:"U9",rx:645,ry:130},{id:10,label:"U10",rx:645,ry:175},{id:11,label:"U11",rx:645,ry:220},
           {id:12,label:"U12",rx:645,ry:265},{id:13,label:"U13",rx:645,ry:310},{id:14,label:"U14",rx:645,ry:355},
           {id:15,label:"U15",rx:645,ry:400},{id:16,label:"U16",rx:645,ry:445}] },
  { id:"rowC",   label:"Row C",   sublabel:"Mobile Homes South", x:135, y:460, w:452, h:52,
    units:[{id:17,label:"U17",rx:165,ry:486},{id:18,label:"U18",rx:220,ry:486},{id:19,label:"U19",rx:275,ry:486},
           {id:20,label:"U20",rx:330,ry:486},{id:21,label:"U21",rx:385,ry:486},{id:22,label:"U22",rx:440,ry:486},
           {id:23,label:"U23",rx:495,ry:486},{id:24,label:"U24",rx:550,ry:486}] },
];

const STATUS_COLOR = { active:"#22c55e", paid:"#38bdf8", expired:"#f87171", offline:"#334155" };
const STATUS_LABEL = { active:"Active", paid:"Paid", expired:"Expired", offline:"No Device" };

function PropertyMap({ users, maint, setMaint, toast2 }) {
  const [zoom,    setZoom]   = useState(1);
  const [selUnit, setSelUnit]= useState(null);
  const [selCam,  setSelCam] = useState(null);
  const [camFeed, setCamFeed]= useState(null);
  const [layers,  setLayers] = useState({wifi:true,cameras:true,units:true,alerts:true});
  const [pulse,   setPulse]  = useState(true);

  useEffect(()=>{ const t=setInterval(()=>setPulse(p=>!p),900); return()=>clearInterval(t); },[]);

  function uStatus(uid){ const u=users.find(x=>x.id===uid); return u?u.status:"offline"; }
  function uMaint(uid){
    const u=users.find(x=>x.id===uid); if(!u) return [];
    return maint.filter(r=>r.unit===u.unit&&r.status!=="resolved");
  }
  function uData(uid){ return users.find(x=>x.id===uid)||null; }

  const activeCount = users.filter(u=>u.status==="active").length;
  const paidCount   = users.filter(u=>u.status==="paid").length;
  const expiredCount= users.filter(u=>u.status==="expired").length;
  const alertCount  = maint.filter(r=>r.status!=="resolved").length;
  const camOnline   = CAMERAS.filter(c=>c.status==="online").length;

  function handleUnitClick(bld, unit) {
    const st=uStatus(unit.id), reqs=uMaint(unit.id), ud=uData(unit.id);
    setSelUnit({...unit, building:bld.label, status:st, reqs, userData:ud});
    setSelCam(null); setCamFeed(null);
  }
  function clearAll(){ setSelUnit(null); setSelCam(null); setCamFeed(null); }

  function bldSummary(bld){
    const statuses=bld.units.map(u=>uStatus(u.id));
    const alerts=bld.units.reduce((a,u)=>a+uMaint(u.id).length,0);
    let color="#334155";
    if(statuses.includes("active")) color="#22c55e";
    if(statuses.includes("paid"))   color="#38bdf8";
    if(statuses.some(s=>s==="expired")) color="#f87171";
    if(alerts>0) color="#fb923c";
    return {color,alerts};
  }

  return (
    <div>
      {/* Stats bar */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:12}}>
        {[{lbl:"Active",val:activeCount,col:"#22c55e"},{lbl:"Paid",val:paidCount,col:"#38bdf8"},
          {lbl:"Expired",val:expiredCount,col:"#f87171"},{lbl:"Alerts",val:alertCount,col:"#fb923c"},
          {lbl:"Cameras",val:`${camOnline}/${CAMERAS.length}`,col:"#a78bfa"}].map(s=>(
          <div key={s.lbl} style={{background:"var(--card)",border:`1px solid ${s.col}33`,borderRadius:10,padding:"8px 4px",textAlign:"center"}}>
            <div style={{fontSize:17,fontWeight:700,color:s.col,fontFamily:"'DM Mono',monospace"}}>{s.val}</div>
            <div style={{fontSize:9,color:"var(--muted)",marginTop:2}}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
        {[{id:"units",lbl:"Units",col:"#22c55e"},{id:"cameras",lbl:"Cameras",col:"#38bdf8"},
          {id:"wifi",lbl:"WiFi",col:"#a78bfa"},{id:"alerts",lbl:"Alerts",col:"#fb923c"}].map(l=>(
          <button key={l.id} onClick={()=>setLayers(x=>({...x,[l.id]:!x[l.id]}))} style={{
            padding:"4px 11px",borderRadius:20,border:`1px solid ${layers[l.id]?l.col:"var(--border)"}`,
            background:layers[l.id]?l.col+"22":"transparent",color:layers[l.id]?l.col:"var(--muted)",
            fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"'Sora',sans-serif",transition:"all .15s"
          }}>{l.lbl}</button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:5,alignItems:"center"}}>
          <button onClick={()=>setZoom(z=>Math.max(0.6,z-0.2))} style={{width:28,height:28,borderRadius:7,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
          <span style={{fontSize:10,color:"var(--muted)",fontFamily:"'DM Mono',monospace",minWidth:34,textAlign:"center"}}>{Math.round(zoom*100)}%</span>
          <button onClick={()=>setZoom(z=>Math.min(2.2,z+0.2))} style={{width:28,height:28,borderRadius:7,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
          <button onClick={()=>{setZoom(1);clearAll();}} style={{padding:"4px 9px",borderRadius:7,border:"1px solid var(--border)",background:"transparent",color:"var(--muted)",fontSize:10,cursor:"pointer",fontFamily:"'Sora',sans-serif"}}>Reset</button>
        </div>
      </div>

      {/* Map */}
      <div style={{background:"#070d14",borderRadius:14,border:"1px solid #1a2a3a",overflow:"hidden",position:"relative"}}>
        <div style={{position:"absolute",top:10,left:10,zIndex:10,background:"#070d14cc",border:"1px solid #1a2a3a",borderRadius:8,padding:"4px 10px",display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",boxShadow:`0 0 ${pulse?6:2}px #22c55e`,transition:"box-shadow .4s"}}/>
          <span style={{fontSize:9,color:"#22c55e",fontFamily:"'DM Mono',monospace",fontWeight:700}}>LIVE</span>
          <span style={{fontSize:9,color:"#374151",fontFamily:"'DM Mono',monospace"}}>BGT · Bradenton FL</span>
        </div>

        <div style={{overflow:"hidden",width:"100%"}}>
          <div style={{transform:`scale(${zoom})`,transformOrigin:"top center",transition:"transform .2s"}}>
            <svg viewBox="0 0 712 540" style={{width:"100%",display:"block"}}>
              <rect width="712" height="540" fill="#080e18"/>
              {/* Streets */}
              <rect x="0" y="516" width="712" height="24" fill="#0e1620"/>
              <text x="356" y="531" textAnchor="middle" fontSize="8" fill="#2d3f55" fontFamily="monospace" letterSpacing="2">8TH AVE E</text>
              <rect x="385" y="22" width="26" height="494" fill="#0e1620"/>
              <text x="398" y="270" textAnchor="middle" fontSize="8" fill="#2d3f55" fontFamily="monospace" transform="rotate(-90,398,270)" letterSpacing="1">13TH ST E</text>
              <rect x="0" y="0" width="712" height="22" fill="#0e1620"/>
              <text x="190" y="14" textAnchor="middle" fontSize="7" fill="#2d3f55" fontFamily="monospace">11TH AVE E</text>
              {/* Property boundary */}
              <rect x="28" y="26" width="652" height="484" fill="none" stroke="#1a3a2a" strokeWidth="1" strokeDasharray="8,5"/>
              <rect x="29" y="27" width="650" height="482" fill="#0b1610" opacity="0.5"/>
              {/* WiFi coverage */}
              {layers.wifi && <>
                <ellipse cx="398" cy="90" rx="270" ry="210" fill="#22c55e" opacity="0.03"/>
                <ellipse cx="398" cy="90" rx="185" ry="145" fill="#22c55e" opacity="0.04"/>
                <ellipse cx="398" cy="90" rx="95"  ry="80"  fill="#22c55e" opacity="0.06"/>
                {[58,115,185].map((r,i)=>(
                  <ellipse key={i} cx="398" cy="90" rx={r} ry={r*0.75} fill="none"
                    stroke="#a78bfa" strokeWidth="0.6" opacity={0.12-i*0.03} strokeDasharray="5,8"/>
                ))}
              </>}
              {/* Church */}
              <rect x="110" y="70" width="225" height="160" rx="5" fill="#091a10" stroke="#22c55e" strokeWidth="1.5"/>
              <rect x="110" y="70" width="225" height="20" rx="5" fill="#0d2a18"/>
              <text x="222" y="85" textAnchor="middle" fontSize="10" fill="#22c55e" fontFamily="sans-serif" fontWeight="700">⛪ CHURCH</text>
              <text x="222" y="148" textAnchor="middle" fontSize="8" fill="#1e4a2a" fontFamily="sans-serif">Bradenton Gospel Tabernacle</text>
              <line x1="222" y1="168" x2="222" y2="205" stroke="#22c55e" strokeWidth="2.5" opacity="0.5"/>
              <line x1="210" y1="180" x2="234" y2="180" stroke="#22c55e" strokeWidth="2.5" opacity="0.5"/>
              {/* School */}
              <rect x="232" y="112" width="112" height="75" rx="4" fill="#091520" stroke="#38bdf8" strokeWidth="1.5"/>
              <rect x="232" y="112" width="112" height="18" rx="4" fill="#0d2030"/>
              <text x="288" y="125" textAnchor="middle" fontSize="9" fill="#38bdf8" fontFamily="sans-serif" fontWeight="700">🎓 SCHOOL</text>
              <text x="288" y="165" textAnchor="middle" fontSize="7" fill="#1a3550" fontFamily="monospace">BGT ACADEMY</text>
              {/* Parking */}
              <rect x="418" y="90" width="148" height="108" rx="4" fill="#0c1520" stroke="#1e2a3a" strokeWidth="1"/>
              {[0,1,2,3,4].map(i=><line key={i} x1={440+i*26} y1="95" x2={440+i*26} y2="193" stroke="#1a2a3a" strokeWidth="0.8"/>)}
              <text x="492" y="207" textAnchor="middle" fontSize="8" fill="#2d3f55" fontFamily="monospace">PARKING</text>
              {/* Store A */}
              <rect x="418" y="248" width="78" height="58" rx="4" fill="#1a1500" stroke="#fbbf24" strokeWidth="1.5"/>
              <rect x="418" y="248" width="78" height="17" rx="4" fill="#241e00"/>
              <text x="457" y="260" textAnchor="middle" fontSize="9" fill="#fbbf24" fontFamily="sans-serif" fontWeight="700">STORE A</text>
              <text x="457" y="288" textAnchor="middle" fontSize="7" fill="#5a4a00" fontFamily="monospace">COMMERCIAL</text>
              {/* Store B */}
              <rect x="508" y="248" width="78" height="58" rx="4" fill="#1a1500" stroke="#fbbf24" strokeWidth="1.5"/>
              <rect x="508" y="248" width="78" height="17" rx="4" fill="#241e00"/>
              <text x="547" y="260" textAnchor="middle" fontSize="9" fill="#fbbf24" fontFamily="sans-serif" fontWeight="700">STORE B</text>
              <text x="547" y="288" textAnchor="middle" fontSize="7" fill="#5a4a00" fontFamily="monospace">COMMERCIAL</text>
              {/* Router */}
              <circle cx="398" cy="90" r="14" fill="#100d1e" stroke="#a78bfa" strokeWidth={pulse?2:1.5}/>
              <text x="398" y="95" textAnchor="middle" fontSize="12">📡</text>
              <text x="398" y="113" textAnchor="middle" fontSize="7" fill="#6d48d8" fontFamily="monospace">ROUTER</text>
              {/* Buildings + Unit dots */}
              {layers.units && BUILDINGS.map(bld=>{
                const {color,alerts}=bldSummary(bld);
                return (
                  <g key={bld.id}>
                    <rect x={bld.x} y={bld.y} width={bld.w} height={bld.h} rx="5" fill="#0a1a10" stroke={color} strokeWidth="1"/>
                    <rect x={bld.x} y={bld.y} width={bld.w} height={16} rx="5" fill={color+"22"}/>
                    <text x={bld.x+bld.w/2} y={bld.y+11} textAnchor="middle" fontSize="8" fill={color} fontFamily="sans-serif" fontWeight="700">{bld.label}</text>
                    {alerts>0 && layers.alerts && <>
                      <circle cx={bld.x+bld.w-6} cy={bld.y+6} r={7} fill="#fb923c" opacity={pulse?1:0.7}/>
                      <text x={bld.x+bld.w-6} y={bld.y+10} textAnchor="middle" fontSize="7" fill="#fff" fontWeight="700">{alerts}</text>
                    </>}
                    {bld.units.map(unit=>{
                      const st=uStatus(unit.id), col=STATUS_COLOR[st];
                      const reqs=uMaint(unit.id), has=reqs.length>0;
                      const sel=selUnit?.id===unit.id;
                      return (
                        <g key={unit.id} style={{cursor:"pointer"}} onClick={e=>{e.stopPropagation();handleUnitClick(bld,unit);}}>
                          {has&&layers.alerts&&<circle cx={unit.rx} cy={unit.ry} r={12} fill="none" stroke="#fb923c" strokeWidth={pulse?2:1} opacity={pulse?0.9:0.4}/>}
                          <circle cx={unit.rx} cy={unit.ry} r={8} fill={col} opacity={sel?1:0.82}/>
                          {sel&&<circle cx={unit.rx} cy={unit.ry} r={12} fill="none" stroke={col} strokeWidth={2}/>}
                          <text x={unit.rx} y={unit.ry+20} textAnchor="middle" fontSize="7" fill="#64748b" fontFamily="monospace">{unit.label}</text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
              {/* Cameras */}
              {layers.cameras && CAMERAS.map((cam,ci)=>{
                const sel=selCam?.id===cam.id, online=cam.status==="online";
                return (
                  <g key={cam.id} style={{cursor:"pointer"}} onClick={()=>{setSelCam(sel?null:cam);setSelUnit(null);setCamFeed(null);}}>
                    {online&&<path d={`M${cam.x},${cam.y} L${cam.x-16},${cam.y+20} L${cam.x+16},${cam.y+20} Z`} fill={sel?"#38bdf820":"#38bdf80d"} stroke="none"/>}
                    <rect x={cam.x-10} y={cam.y-8} width={20} height={14} rx={3} fill={sel?"#1a3a5f":"#0d1e30"} stroke={online?"#38bdf8":"#f87171"} strokeWidth={sel?2:1}/>
                    <circle cx={cam.x+5} cy={cam.y} r={3} fill={online?"#38bdf8":"#f87171"} opacity={online&&pulse?1:0.5}/>
                    <rect x={cam.x-8} y={cam.y-5} width={9} height={8} rx={1} fill={online?"#0c2a3a":"#2a0a0a"}/>
                    <text x={cam.x} y={cam.y+18} textAnchor="middle" fontSize="7" fill={sel?"#38bdf8":"#3d5a7a"} fontFamily="monospace">{cam.label.split(" ")[0]}</text>
                  </g>
                );
              })}
              {/* Compass */}
              <g transform="translate(685,48)">
                <circle cx="0" cy="0" r="12" fill="#0d1620" stroke="#1e2a3a" strokeWidth="1"/>
                <polygon points="0,-9 -3,2 3,2" fill="#f87171"/>
                <polygon points="0,9 -3,-2 3,-2" fill="#374151"/>
                <text x="0" y="-12" textAnchor="middle" fontSize="7" fill="#f87171" fontFamily="monospace">N</text>
              </g>
              <text x="32" y="510" fontSize="7" fill="#1e2a3a" fontFamily="monospace">27.4894°N  82.5748°W  ·  Bradenton, FL</text>
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div style={{background:"#0a1018",borderTop:"1px solid #1a2a3a",padding:"7px 14px",display:"flex",gap:12,flexWrap:"wrap"}}>
          {[{col:"#22c55e",lbl:"Active"},{col:"#38bdf8",lbl:"Paid"},{col:"#f87171",lbl:"Expired"},{col:"#334155",lbl:"No Device"},{col:"#fb923c",lbl:"Alert"},{col:"#38bdf8",lbl:"Cam Online"},{col:"#f87171",lbl:"Cam Offline"}].map(l=>(
            <div key={l.lbl} style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:l.col}}/>
              <span style={{fontSize:9,color:"#4a5a6a",fontFamily:"monospace"}}>{l.lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Unit detail */}
      {selUnit && (
        <div style={{background:"var(--card)",border:`1px solid ${STATUS_COLOR[selUnit.status]}55`,borderRadius:14,padding:14,marginTop:12,animation:"fadeUp .25s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <div style={{fontSize:15,fontWeight:700}}>{selUnit.userData?.unit||selUnit.label}</div>
              <div style={{fontSize:11,color:"var(--muted)"}}>{selUnit.userData?.name||"Unoccupied"} · {selUnit.building}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:20,
                background:STATUS_COLOR[selUnit.status]+"22",color:STATUS_COLOR[selUnit.status],
                border:`1px solid ${STATUS_COLOR[selUnit.status]}44`}}>{STATUS_LABEL[selUnit.status]}</span>
              <button onClick={()=>setSelUnit(null)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
          </div>
          {selUnit.userData && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[{l:"IP",v:selUnit.userData.ip},{l:"Data",v:selUnit.userData.dataUsed},{l:"Last Seen",v:selUnit.userData.lastSeen},{l:"Free Used",v:`${selUnit.userData.minutesUsed}/60 min`}].map(f=>(
                <div key={f.l}><div style={{fontSize:9,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:2}}>{f.l}</div><div style={{fontSize:11,fontWeight:600,fontFamily:"'DM Mono',monospace"}}>{f.v}</div></div>
              ))}
            </div>
          )}
          {selUnit.reqs.length>0 && <>
            <div style={{fontSize:10,color:"#fb923c",textTransform:"uppercase",letterSpacing:".05em",marginBottom:8}}>🔧 Open Requests ({selUnit.reqs.length})</div>
            {selUnit.reqs.map((r,i)=>(
              <div key={i} style={{background:"var(--surface)",border:"1px solid #fb923c33",borderRadius:9,padding:"9px 11px",marginBottom:7}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:700,textTransform:"capitalize"}}>{r.category}</span>
                  <span style={{fontSize:9,padding:"2px 8px",borderRadius:20,fontWeight:700,
                    background:r.status==="new"?"#1a0b0b":"#1a1000",color:r.status==="new"?"#f87171":"#fb923c",
                    border:`1px solid ${r.status==="new"?"#3a1e1e":"#4a3000"}`}}>{r.status.replace("_"," ")}</span>
                </div>
                <div style={{fontSize:11,color:"var(--muted)",lineHeight:1.5,marginBottom:7}}>{r.message}</div>
                <div style={{display:"flex",gap:6}}>
                  {r.status==="new"&&<button className="abtn abtn-g" style={{padding:"5px 10px",fontSize:10}} onClick={()=>{setMaint(rs=>rs.map(x=>x.message===r.message?{...x,status:"in_progress"}:x));toast2("Marked in progress");}}>In Progress</button>}
                  {r.status!=="resolved"&&<button className="abtn abtn-g" style={{padding:"5px 10px",fontSize:10}} onClick={()=>{setMaint(rs=>rs.map(x=>x.message===r.message?{...x,status:"resolved"}:x));setSelUnit(s=>({...s,reqs:s.reqs.filter((_,j)=>j!==i)}));toast2("✓ Resolved");}}>Resolve</button>}
                </div>
              </div>
            ))}
          </>}
          {selUnit.reqs.length===0&&<div style={{fontSize:11,color:"var(--muted)",textAlign:"center",padding:"6px 0"}}>✓ No open maintenance requests</div>}
        </div>
      )}

      {/* Camera detail */}
      {selCam && !camFeed && (
        <div style={{background:"var(--card)",border:`1px solid ${selCam.status==="online"?"#38bdf833":"#f8717133"}`,borderRadius:14,padding:14,marginTop:12,animation:"fadeUp .25s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{fontSize:15,fontWeight:700}}>📷 {selCam.label}</div>
              <div style={{fontSize:11,color:"var(--muted)",fontFamily:"'DM Mono',monospace"}}>{selCam.id.toUpperCase()} · Zone: {selCam.zone}</div>
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 9px",borderRadius:20,
                background:selCam.status==="online"?"#0a1520":"#1a0b0b",border:`1px solid ${selCam.status==="online"?"#1a3050":"#3a1e1e"}`}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:selCam.status==="online"?"#38bdf8":"#f87171",boxShadow:selCam.status==="online"&&pulse?"0 0 5px #38bdf8":"none"}}/>
                <span style={{fontSize:10,fontWeight:700,color:selCam.status==="online"?"#38bdf8":"#f87171"}}>{selCam.status.toUpperCase()}</span>
              </div>
              <button onClick={()=>setSelCam(null)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:18}}>✕</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {[{l:"Channel",v:`DVR Ch.${CAMERAS.indexOf(selCam)+1}`},{l:"Resolution",v:selCam.status==="online"?"1080p / 30fps":"—"},
              {l:"Recording",v:selCam.status==="online"?"Active · 24/7":"Offline"},{l:"Last Event",v:"2 min ago"}].map(f=>(
              <div key={f.l}><div style={{fontSize:9,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:2}}>{f.l}</div><div style={{fontSize:11,fontWeight:600}}>{f.v}</div></div>
            ))}
          </div>
          {selCam.status==="online"
            ? <button className="btn" style={{fontSize:13,padding:"11px"}} onClick={()=>setCamFeed(selCam)}>▶ View Live Feed</button>
            : <div style={{background:"#1a0b0b",border:"1px solid #3a1e1e",borderRadius:9,padding:"10px",textAlign:"center",fontSize:12,color:"#f87171"}}>⚠ Camera offline — check DVR port {CAMERAS.indexOf(selCam)+1}</div>}
        </div>
      )}

      {/* DVR Feed */}
      {camFeed && (
        <div style={{background:"#000",borderRadius:14,border:"1px solid #1a2a3a",overflow:"hidden",marginTop:12,animation:"fadeUp .25s ease"}}>
          <div style={{background:"#0a1018",padding:"8px 14px",borderBottom:"1px solid #1a2a3a",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#f87171",boxShadow:pulse?"0 0 5px #f87171":"none"}}/>
              <span style={{fontSize:10,color:"#f87171",fontFamily:"monospace",fontWeight:700}}>● REC</span>
              <span style={{fontSize:11,color:"#64748b",fontFamily:"monospace"}}>{camFeed.label} · CH{CAMERAS.indexOf(camFeed)+1}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:9,color:"#374151",fontFamily:"monospace"}}>{new Date().toLocaleTimeString()}</span>
              <button onClick={()=>setCamFeed(null)} style={{background:"none",border:"none",color:"#64748b",cursor:"pointer",fontSize:16}}>✕</button>
            </div>
          </div>
          <div style={{position:"relative",background:"#040a0e",aspectRatio:"16/9",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.12) 3px,rgba(0,0,0,.12) 4px)",zIndex:2,pointerEvents:"none"}}/>
            <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 50%,transparent 40%,#000 100%)",zIndex:2,pointerEvents:"none"}}/>
            <div style={{opacity:0.2,fontSize:48,zIndex:1}}>📹</div>
            {["tl","tr","bl","br"].map(c=>(
              <div key={c} style={{position:"absolute",top:c.includes("t")?10:"auto",bottom:c.includes("b")?10:"auto",left:c.includes("l")?10:"auto",right:c.includes("r")?10:"auto",width:20,height:20,zIndex:3,
                borderTop:c.includes("t")?"2px solid #22c55e55":"none",borderBottom:c.includes("b")?"2px solid #22c55e55":"none",
                borderLeft:c.includes("l")?"2px solid #22c55e55":"none",borderRight:c.includes("r")?"2px solid #22c55e55":"none"}}/>
            ))}
            <div style={{position:"absolute",top:10,left:14,fontSize:9,color:"#22c55e",fontFamily:"monospace",opacity:0.7,zIndex:3}}>{camFeed.label} · 1080P</div>
            <div style={{position:"absolute",top:10,right:14,fontSize:9,color:"#22c55e",fontFamily:"monospace",opacity:0.7,zIndex:3}}>{new Date().toLocaleDateString()}</div>
            <div style={{position:"absolute",bottom:10,left:0,right:0,textAlign:"center",fontSize:9,color:"#374151",fontFamily:"monospace",zIndex:3}}>Connect DVR to network for live stream · RTSP :554</div>
          </div>
          <div style={{background:"#0a1018",borderTop:"1px solid #1a2a3a",padding:"8px 14px",display:"flex",gap:6}}>
            {[{i:"⏮",l:"Playback"},{i:"📸",l:"Snapshot"},{i:"⛶",l:"Fullscreen"},{i:"🔊",l:"Audio"}].map(b=>(
              <button key={b.l} style={{flex:1,padding:"7px 4px",borderRadius:7,border:"1px solid #1a2a3a",background:"transparent",color:"#4a5a6a",fontSize:10,cursor:"pointer",fontFamily:"sans-serif",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <span style={{fontSize:14}}>{b.i}</span><span>{b.l}</span>
              </button>
            ))}
          </div>
          {/* All cameras grid */}
          <div style={{background:"#070d14",borderTop:"1px solid #1a2a3a",padding:"10px 14px"}}>
            <div style={{fontSize:9,color:"#374151",fontFamily:"monospace",marginBottom:8,letterSpacing:"1px"}}>ALL CHANNELS</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
              {CAMERAS.map((c,i)=>(
                <div key={c.id} onClick={()=>setCamFeed(c)} style={{
                  background:c.id===camFeed.id?"#0d2030":"#0a0e14",
                  border:`1px solid ${c.id===camFeed.id?"#38bdf8":c.status==="online"?"#1a2a3a":"#2a1010"}`,
                  borderRadius:7,padding:"7px 6px",cursor:"pointer",textAlign:"center",transition:"all .15s"}}>
                  <div style={{fontSize:8,color:c.status==="online"?"#38bdf8":"#f87171",fontFamily:"monospace",marginBottom:2}}>CH{i+1}</div>
                  <div style={{fontSize:8,color:"#4a5a6a",fontFamily:"monospace",lineHeight:1.3}}>{c.label}</div>
                  <div style={{width:5,height:5,borderRadius:"50%",background:c.status==="online"?"#22c55e":"#f87171",margin:"4px auto 0",boxShadow:c.status==="online"&&pulse?"0 0 4px #22c55e":"none"}}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [view,    setView]   = useState("resident");
  const [dark,    setDark]   = useState(true);
  const [authed,  setAuthed] = useState(false);
  const [events,  setEvents] = useState(INITIAL_EVENTS);
  const [posts,   setPosts]  = useState(INITIAL_TENANT_POSTS);
  const [maint,   setMaint]  = useState(INITIAL_MAINT);

  useEffect(()=>{ document.body.classList.toggle("light",!dark); },[dark]);

  function addMaint(req){ setMaint(r=>[{...req,id:Date.now()},...r]); }

  const showAdmin = view==="admin" && authed;
  const showLogin = view==="admin" && !authed;

  return (
    <AppCtx.Provider value={{addMaint}}>
      <style>{css}</style>
      <nav className="nav">
        {/* Logo + name */}
        <div className="nav-logo">
          <Logo size={28}/>
          <span className="nav-name">Bradenton Gospel Tabernacle</span>
        </div>

        {/* Tabs */}
        <div className="nav-tabs">
          <button className={`nav-tab ${view==="resident"?"active":""}`} onClick={()=>setView("resident")}>Resident</button>
          <button className={`nav-tab ${view==="guest"   ?"active":""}`} onClick={()=>setView("guest")}>Guest</button>
          <button className={`nav-tab ${view==="admin"   ?"active":""}`} onClick={()=>setView("admin")}>{authed?"🟢 Admin":"Admin"}</button>
        </div>

        {/* Right: toggle + signout */}
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <span style={{fontSize:13}}>{dark?"🌙":"☀️"}</span>
          <button className="tog" onClick={()=>setDark(d=>!d)}/>
          {authed&&<>
            <div style={{width:1,height:18,background:"var(--border)"}}/>
            <button onClick={()=>setAuthed(false)} style={{fontSize:10,padding:"3px 9px",borderRadius:6,border:"1px solid var(--border)",background:"transparent",color:"var(--muted)",cursor:"pointer",fontFamily:"'Sora',sans-serif",whiteSpace:"nowrap"}}>Sign out</button>
          </>}
        </div>
      </nav>

      {view==="resident" && <TenantPortal events={events} posts={posts}/>}
      {view==="guest"    && <GuestPortal  events={events}/>}
      {showLogin         && <AdminLogin   onLogin={()=>setAuthed(true)}/>}
      {showAdmin         && <Admin events={events} setEvents={setEvents} posts={posts} setPosts={setPosts} maint={maint} setMaint={setMaint}/>}
    </AppCtx.Provider>
  );
}