import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from "@material-ui/core";
// import ReactImageAnnotate from "react-image-annotate/ImageCanvas";
import Annotator from '../../annotator';
import { URL_MAP } from '../../others/artificio_api.instance';


let sampleJson = {
  "metadata": {
      "bucket_details": {
          "bucket_name": "artificio-datasets",
          "source_folder_name": "un-processed"
      },
      "image_details": {
          "filename": "202010236445-KA119F11O0002-9_page-0001.jpg",
          "file_extension": "JPG",
          "file_size": {
              "height": "1650",
              "width": "1275"
          }
      }
  },
  "text_annotations": [
      {
          "block_details": {
              "block_description": "FCBUIka Advertising Pvt. Ltd. (Formerly known as Drafticc Ulka Advertising Pvt. Ltd.) ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 505,
                          "y": 69
                      },
                      {
                          "x": 1047,
                          "y": 69
                      },
                      {
                          "x": 1047,
                          "y": 86
                      },
                      {
                          "x": 505,
                          "y": 86
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "FCBUIka",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 505,
                              "y": 69
                          },
                          {
                              "x": 63,
                              "y": 69
                          },
                          {
                              "x": 63,
                              "y": 17
                          },
                          {
                              "x": 505,
                              "y": 17
                          }
                      ]
                  }
              },
              {
                  "word_description": "Advertising",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 567,
                              "y": 69
                          },
                          {
                              "x": 78,
                              "y": 69
                          },
                          {
                              "x": 78,
                              "y": 17
                          },
                          {
                              "x": 567,
                              "y": 17
                          }
                      ]
                  }
              },
              {
                  "word_description": "Pvt.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 644,
                              "y": 69
                          },
                          {
                              "x": 27,
                              "y": 69
                          },
                          {
                              "x": 27,
                              "y": 17
                          },
                          {
                              "x": 644,
                              "y": 17
                          }
                      ]
                  }
              },
              {
                  "word_description": "Ltd.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 670,
                              "y": 69
                          },
                          {
                              "x": 24,
                              "y": 69
                          },
                          {
                              "x": 24,
                              "y": 14
                          },
                          {
                              "x": 670,
                              "y": 14
                          }
                      ]
                  }
              },
              {
                  "word_description": "(Formerly",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 698,
                              "y": 69
                          },
                          {
                              "x": 63,
                              "y": 69
                          },
                          {
                              "x": 63,
                              "y": 17
                          },
                          {
                              "x": 698,
                              "y": 17
                          }
                      ]
                  }
              },
              {
                  "word_description": "known",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 762,
                              "y": 69
                          },
                          {
                              "x": 43,
                              "y": 69
                          },
                          {
                              "x": 43,
                              "y": 16
                          },
                          {
                              "x": 762,
                              "y": 16
                          }
                      ]
                  }
              },
              {
                  "word_description": "as",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 806,
                              "y": 72
                          },
                          {
                              "x": 17,
                              "y": 72
                          },
                          {
                              "x": 17,
                              "y": 8
                          },
                          {
                              "x": 806,
                              "y": 8
                          }
                      ]
                  }
              },
              {
                  "word_description": "Drafticc",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 825,
                              "y": 69
                          },
                          {
                              "x": 55,
                              "y": 69
                          },
                          {
                              "x": 55,
                              "y": 14
                          },
                          {
                              "x": 825,
                              "y": 14
                          }
                      ]
                  }
              },
              {
                  "word_description": "Ulka",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 879,
                              "y": 69
                          },
                          {
                              "x": 32,
                              "y": 69
                          },
                          {
                              "x": 32,
                              "y": 14
                          },
                          {
                              "x": 879,
                              "y": 14
                          }
                      ]
                  }
              },
              {
                  "word_description": "Advertising",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 912,
                              "y": 69
                          },
                          {
                              "x": 76,
                              "y": 69
                          },
                          {
                              "x": 76,
                              "y": 17
                          },
                          {
                              "x": 912,
                              "y": 17
                          }
                      ]
                  }
              },
              {
                  "word_description": "Pvt.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 990,
                              "y": 69
                          },
                          {
                              "x": 26,
                              "y": 69
                          },
                          {
                              "x": 26,
                              "y": 14
                          },
                          {
                              "x": 990,
                              "y": 14
                          }
                      ]
                  }
              },
              {
                  "word_description": "Ltd.)",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1015,
                              "y": 69
                          },
                          {
                              "x": 32,
                              "y": 69
                          },
                          {
                              "x": 32,
                              "y": 17
                          },
                          {
                              "x": 1015,
                              "y": 17
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "FCBULKA ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 198,
                          "y": 85
                      },
                      {
                          "x": 441,
                          "y": 85
                      },
                      {
                          "x": 441,
                          "y": 135
                      },
                      {
                          "x": 198,
                          "y": 135
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "FCBULKA",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 198,
                              "y": 85
                          },
                          {
                              "x": 243,
                              "y": 85
                          },
                          {
                              "x": 243,
                              "y": 50
                          },
                          {
                              "x": 198,
                              "y": 50
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "1103 Tel: Website: 65399800 5 Barton www.i.bulka. Regd. Centre, Oil: com 84, 4th m Floor,\" - - Road Nirmal. Bengaluru Nariman 560001. Point, Mumbai 400021. ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 505,
                          "y": 85
                      },
                      {
                          "x": 983,
                          "y": 85
                      },
                      {
                          "x": 983,
                          "y": 117
                      },
                      {
                          "x": 505,
                          "y": 117
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "1103",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 505,
                              "y": 85
                          },
                          {
                              "x": 34,
                              "y": 85
                          },
                          {
                              "x": 34,
                              "y": 16
                          },
                          {
                              "x": 505,
                              "y": 16
                          }
                      ]
                  }
              },
              {
                  "word_description": "Tel:",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 505,
                              "y": 103
                          },
                          {
                              "x": 27,
                              "y": 103
                          },
                          {
                              "x": 27,
                              "y": 14
                          },
                          {
                              "x": 505,
                              "y": 14
                          }
                      ]
                  }
              },
              {
                  "word_description": "Website:",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 505,
                              "y": 121
                          },
                          {
                              "x": 60,
                              "y": 121
                          },
                          {
                              "x": 60,
                              "y": 14
                          },
                          {
                              "x": 505,
                              "y": 14
                          }
                      ]
                  }
              },
              {
                  "word_description": "65399800",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 531,
                              "y": 103
                          },
                          {
                              "x": 62,
                              "y": 103
                          },
                          {
                              "x": 62,
                              "y": 16
                          },
                          {
                              "x": 531,
                              "y": 16
                          }
                      ]
                  }
              },
              {
                  "word_description": "5",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 548,
                              "y": 88
                          },
                          {
                              "x": 7,
                              "y": 88
                          },
                          {
                              "x": 7,
                              "y": 9
                          },
                          {
                              "x": 548,
                              "y": 9
                          }
                      ]
                  }
              },
              {
                  "word_description": "Barton",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 562,
                              "y": 87
                          },
                          {
                              "x": 44,
                              "y": 87
                          },
                          {
                              "x": 44,
                              "y": 14
                          },
                          {
                              "x": 562,
                              "y": 14
                          }
                      ]
                  }
              },
              {
                  "word_description": "www.i.bulka.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 562,
                              "y": 121
                          },
                          {
                              "x": 88,
                              "y": 121
                          },
                          {
                              "x": 88,
                              "y": 11
                          },
                          {
                              "x": 562,
                              "y": 11
                          }
                      ]
                  }
              },
              {
                  "word_description": "Regd.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 598,
                              "y": 103
                          },
                          {
                              "x": 37,
                              "y": 103
                          },
                          {
                              "x": 37,
                              "y": 19
                          },
                          {
                              "x": 598,
                              "y": 19
                          }
                      ]
                  }
              },
              {
                  "word_description": "Centre,",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 605,
                              "y": 87
                          },
                          {
                              "x": 48,
                              "y": 87
                          },
                          {
                              "x": 48,
                              "y": 14
                          },
                          {
                              "x": 605,
                              "y": 14
                          }
                      ]
                  }
              },
              {
                  "word_description": "Oil:",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 636,
                              "y": 103
                          },
                          {
                              "x": 30,
                              "y": 103
                          },
                          {
                              "x": 30,
                              "y": 11
                          },
                          {
                              "x": 636,
                              "y": 11
                          }
                      ]
                  }
              },
              {
                  "word_description": "com",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 649,
                              "y": 121
                          },
                          {
                              "x": 32,
                              "y": 121
                          },
                          {
                              "x": 32,
                              "y": 14
                          },
                          {
                              "x": 649,
                              "y": 14
                          }
                      ]
                  }
              },
              {
                  "word_description": "84,",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 654,
                              "y": 85
                          },
                          {
                              "x": 22,
                              "y": 85
                          },
                          {
                              "x": 22,
                              "y": 16
                          },
                          {
                              "x": 654,
                              "y": 16
                          }
                      ]
                  }
              },
              {
                  "word_description": "4th",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 667,
                              "y": 103
                          },
                          {
                              "x": 24,
                              "y": 103
                          },
                          {
                              "x": 24,
                              "y": 14
                          },
                          {
                              "x": 667,
                              "y": 14
                          }
                      ]
                  }
              },
              {
                  "word_description": "m",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 672,
                              "y": 85
                          },
                          {
                              "x": 22,
                              "y": 85
                          },
                          {
                              "x": 22,
                              "y": 16
                          },
                          {
                              "x": 672,
                              "y": 16
                          }
                      ]
                  }
              },
              {
                  "word_description": "Floor,\"",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 690,
                              "y": 103
                          },
                          {
                              "x": 40,
                              "y": 103
                          },
                          {
                              "x": 40,
                              "y": 16
                          },
                          {
                              "x": 690,
                              "y": 16
                          }
                      ]
                  }
              },
              {
                  "word_description": "-",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 696,
                              "y": 88
                          },
                          {
                              "x": 7,
                              "y": 88
                          },
                          {
                              "x": 7,
                              "y": 3
                          },
                          {
                              "x": 696,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "-",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 696,
                              "y": 93
                          },
                          {
                              "x": 8,
                              "y": 93
                          },
                          {
                              "x": 8,
                              "y": 4
                          },
                          {
                              "x": 696,
                              "y": 4
                          }
                      ]
                  }
              },
              {
                  "word_description": "Road",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 706,
                              "y": 87
                          },
                          {
                              "x": 34,
                              "y": 87
                          },
                          {
                              "x": 34,
                              "y": 11
                          },
                          {
                              "x": 706,
                              "y": 11
                          }
                      ]
                  }
              },
              {
                  "word_description": "Nirmal.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 729,
                              "y": 103
                          },
                          {
                              "x": 48,
                              "y": 103
                          },
                          {
                              "x": 48,
                              "y": 11
                          },
                          {
                              "x": 729,
                              "y": 11
                          }
                      ]
                  }
              },
              {
                  "word_description": "Bengaluru",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 745,
                              "y": 87
                          },
                          {
                              "x": 70,
                              "y": 87
                          },
                          {
                              "x": 70,
                              "y": 17
                          },
                          {
                              "x": 745,
                              "y": 17
                          }
                      ]
                  }
              },
              {
                  "word_description": "Nariman",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 778,
                              "y": 103
                          },
                          {
                              "x": 55,
                              "y": 103
                          },
                          {
                              "x": 55,
                              "y": 11
                          },
                          {
                              "x": 778,
                              "y": 11
                          }
                      ]
                  }
              },
              {
                  "word_description": "560001.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 814,
                              "y": 85
                          },
                          {
                              "x": 48,
                              "y": 85
                          },
                          {
                              "x": 48,
                              "y": 16
                          },
                          {
                              "x": 814,
                              "y": 16
                          }
                      ]
                  }
              },
              {
                  "word_description": "Point,",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 837,
                              "y": 103
                          },
                          {
                              "x": 37,
                              "y": 103
                          },
                          {
                              "x": 37,
                              "y": 16
                          },
                          {
                              "x": 837,
                              "y": 16
                          }
                      ]
                  }
              },
              {
                  "word_description": "Mumbai",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 873,
                              "y": 103
                          },
                          {
                              "x": 58,
                              "y": 103
                          },
                          {
                              "x": 58,
                              "y": 11
                          },
                          {
                              "x": 873,
                              "y": 11
                          }
                      ]
                  }
              },
              {
                  "word_description": "400021.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 930,
                              "y": 103
                          },
                          {
                              "x": 53,
                              "y": 103
                          },
                          {
                              "x": 53,
                              "y": 14
                          },
                          {
                              "x": 930,
                              "y": 14
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "GSTNE:39AA.CCOUSGELLEF STATE CODE: 29 -Karnataka ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 505,
                          "y": 136
                      },
                      {
                          "x": 859,
                          "y": 136
                      },
                      {
                          "x": 859,
                          "y": 153
                      },
                      {
                          "x": 505,
                          "y": 153
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "GSTNE:39AA.CCOUSGELLEF",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 505,
                              "y": 136
                          },
                          {
                              "x": 176,
                              "y": 136
                          },
                          {
                              "x": 176,
                              "y": 17
                          },
                          {
                              "x": 505,
                              "y": 17
                          }
                      ]
                  }
              },
              {
                  "word_description": "STATE",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 680,
                              "y": 136
                          },
                          {
                              "x": 48,
                              "y": 136
                          },
                          {
                              "x": 48,
                              "y": 17
                          },
                          {
                              "x": 680,
                              "y": 17
                          }
                      ]
                  }
              },
              {
                  "word_description": "CODE:",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 727,
                              "y": 136
                          },
                          {
                              "x": 44,
                              "y": 136
                          },
                          {
                              "x": 44,
                              "y": 17
                          },
                          {
                              "x": 727,
                              "y": 17
                          }
                      ]
                  }
              },
              {
                  "word_description": "29",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 770,
                              "y": 136
                          },
                          {
                              "x": 22,
                              "y": 136
                          },
                          {
                              "x": 22,
                              "y": 17
                          },
                          {
                              "x": 770,
                              "y": 17
                          }
                      ]
                  }
              },
              {
                  "word_description": "-Karnataka",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 788,
                              "y": 136
                          },
                          {
                              "x": 71,
                              "y": 136
                          },
                          {
                              "x": 71,
                              "y": 17
                          },
                          {
                              "x": 788,
                              "y": 17
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "TAX INVOICE a OCH ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 46,
                          "y": 167
                      },
                      {
                          "x": 364,
                          "y": 167
                      },
                      {
                          "x": 364,
                          "y": 202
                      },
                      {
                          "x": 46,
                          "y": 202
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "TAX",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 46,
                              "y": 167
                          },
                          {
                              "x": 71,
                              "y": 167
                          },
                          {
                              "x": 71,
                              "y": 35
                          },
                          {
                              "x": 46,
                              "y": 35
                          }
                      ]
                  }
              },
              {
                  "word_description": "INVOICE",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 121,
                              "y": 167
                          },
                          {
                              "x": 142,
                              "y": 167
                          },
                          {
                              "x": 142,
                              "y": 35
                          },
                          {
                              "x": 121,
                              "y": 35
                          }
                      ]
                  }
              },
              {
                  "word_description": "a",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 270,
                              "y": 185
                          },
                          {
                              "x": 9,
                              "y": 185
                          },
                          {
                              "x": 9,
                              "y": 4
                          },
                          {
                              "x": 270,
                              "y": 4
                          }
                      ]
                  }
              },
              {
                  "word_description": "OCH",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 288,
                              "y": 167
                          },
                          {
                              "x": 76,
                              "y": 167
                          },
                          {
                              "x": 76,
                              "y": 35
                          },
                          {
                              "x": 288,
                              "y": 35
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "For telecasts IN October, 2019 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 46,
                          "y": 203
                      },
                      {
                          "x": 349,
                          "y": 203
                      },
                      {
                          "x": 349,
                          "y": 222
                      },
                      {
                          "x": 46,
                          "y": 222
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "For",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 46,
                              "y": 203
                          },
                          {
                              "x": 37,
                              "y": 203
                          },
                          {
                              "x": 37,
                              "y": 19
                          },
                          {
                              "x": 46,
                              "y": 19
                          }
                      ]
                  }
              },
              {
                  "word_description": "telecasts",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 85,
                              "y": 203
                          },
                          {
                              "x": 93,
                              "y": 203
                          },
                          {
                              "x": 93,
                              "y": 19
                          },
                          {
                              "x": 85,
                              "y": 19
                          }
                      ]
                  }
              },
              {
                  "word_description": "IN",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 183,
                              "y": 206
                          },
                          {
                              "x": 21,
                              "y": 206
                          },
                          {
                              "x": 21,
                              "y": 16
                          },
                          {
                              "x": 183,
                              "y": 16
                          }
                      ]
                  }
              },
              {
                  "word_description": "October,",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 208,
                              "y": 203
                          },
                          {
                              "x": 89,
                              "y": 203
                          },
                          {
                              "x": 89,
                              "y": 19
                          },
                          {
                              "x": 208,
                              "y": 19
                          }
                      ]
                  }
              },
              {
                  "word_description": "2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 299,
                              "y": 201
                          },
                          {
                              "x": 50,
                              "y": 201
                          },
                          {
                              "x": 50,
                              "y": 21
                          },
                          {
                              "x": 299,
                              "y": 21
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "For telecasts IN October, 2019 Page ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 1104,
                          "y": 199
                      },
                      {
                          "x": 1162,
                          "y": 199
                      },
                      {
                          "x": 1162,
                          "y": 227
                      },
                      {
                          "x": 1104,
                          "y": 227
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "Page",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1104,
                              "y": 199
                          },
                          {
                              "x": 58,
                              "y": 199
                          },
                          {
                              "x": 58,
                              "y": 28
                          },
                          {
                              "x": 1104,
                              "y": 28
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "9 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 1183,
                          "y": 203
                      },
                      {
                          "x": 1194,
                          "y": 203
                      },
                      {
                          "x": 1194,
                          "y": 220
                      },
                      {
                          "x": 1183,
                          "y": 220
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "9",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1183,
                              "y": 203
                          },
                          {
                              "x": 11,
                              "y": 203
                          },
                          {
                              "x": 11,
                              "y": 17
                          },
                          {
                              "x": 1183,
                              "y": 17
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "WIPRO ENTERPRISES PRIVATE LIMITED - TEL ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 54,
                          "y": 247
                      },
                      {
                          "x": 529,
                          "y": 247
                      },
                      {
                          "x": 529,
                          "y": 271
                      },
                      {
                          "x": 54,
                          "y": 271
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "WIPRO",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 54,
                              "y": 247
                          },
                          {
                              "x": 75,
                              "y": 247
                          },
                          {
                              "x": 75,
                              "y": 22
                          },
                          {
                              "x": 54,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "ENTERPRISES",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 131,
                              "y": 247
                          },
                          {
                              "x": 153,
                              "y": 247
                          },
                          {
                              "x": 153,
                              "y": 24
                          },
                          {
                              "x": 131,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "PRIVATE",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 286,
                              "y": 247
                          },
                          {
                              "x": 96,
                              "y": 247
                          },
                          {
                              "x": 96,
                              "y": 24
                          },
                          {
                              "x": 286,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "LIMITED",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 384,
                              "y": 247
                          },
                          {
                              "x": 88,
                              "y": 247
                          },
                          {
                              "x": 88,
                              "y": 22
                          },
                          {
                              "x": 384,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "-",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 476,
                              "y": 259
                          },
                          {
                              "x": 6,
                              "y": 259
                          },
                          {
                              "x": 6,
                              "y": 3
                          },
                          {
                              "x": 476,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "TEL",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 487,
                              "y": 247
                          },
                          {
                              "x": 42,
                              "y": 247
                          },
                          {
                              "x": 42,
                              "y": 24
                          },
                          {
                              "x": 487,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "WIPRO ENTERPRISES PRIVATE LIMITED - TEL No ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 871,
                          "y": 250
                      },
                      {
                          "x": 903,
                          "y": 250
                      },
                      {
                          "x": 903,
                          "y": 269
                      },
                      {
                          "x": 871,
                          "y": 269
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "No",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 871,
                              "y": 250
                          },
                          {
                              "x": 32,
                              "y": 250
                          },
                          {
                              "x": 32,
                              "y": 19
                          },
                          {
                              "x": 871,
                              "y": 19
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "- I KA119F110000 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 943,
                          "y": 255
                      },
                      {
                          "x": 1122,
                          "y": 255
                      },
                      {
                          "x": 1122,
                          "y": 271
                      },
                      {
                          "x": 943,
                          "y": 271
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "-",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 943,
                              "y": 255
                          },
                          {
                              "x": 3,
                              "y": 255
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 943,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 943,
                              "y": 263
                          },
                          {
                              "x": 3,
                              "y": 263
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 943,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "KA119F110000",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 953,
                              "y": 247
                          },
                          {
                              "x": 169,
                              "y": 247
                          },
                          {
                              "x": 169,
                              "y": 24
                          },
                          {
                              "x": 953,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "IDA EAST DIVISION, ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 51,
                          "y": 270
                      },
                      {
                          "x": 258,
                          "y": 270
                      },
                      {
                          "x": 258,
                          "y": 294
                      },
                      {
                          "x": 51,
                          "y": 294
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "IDA",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 51,
                              "y": 270
                          },
                          {
                              "x": 42,
                              "y": 270
                          },
                          {
                              "x": 42,
                              "y": 24
                          },
                          {
                              "x": 51,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "EAST",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 95,
                              "y": 270
                          },
                          {
                              "x": 60,
                              "y": 270
                          },
                          {
                              "x": 60,
                              "y": 24
                          },
                          {
                              "x": 95,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "DIVISION,",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 157,
                              "y": 270
                          },
                          {
                              "x": 101,
                              "y": 270
                          },
                          {
                              "x": 101,
                              "y": 24
                          },
                          {
                              "x": 157,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "IDA EAST DIVISION, Date ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 871,
                          "y": 273
                      },
                      {
                          "x": 918,
                          "y": 273
                      },
                      {
                          "x": 918,
                          "y": 294
                      },
                      {
                          "x": 871,
                          "y": 294
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "Date",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 871,
                              "y": 273
                          },
                          {
                              "x": 47,
                              "y": 273
                          },
                          {
                              "x": 47,
                              "y": 21
                          },
                          {
                              "x": 871,
                              "y": 21
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "- I 06.11.2019 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 943,
                          "y": 279
                      },
                      {
                          "x": 1063,
                          "y": 279
                      },
                      {
                          "x": 1063,
                          "y": 294
                      },
                      {
                          "x": 943,
                          "y": 294
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "-",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 943,
                              "y": 279
                          },
                          {
                              "x": 3,
                              "y": 279
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 943,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 943,
                              "y": 287
                          },
                          {
                              "x": 3,
                              "y": 287
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 943,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "06.11.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 951,
                              "y": 270
                          },
                          {
                              "x": 112,
                              "y": 270
                          },
                          {
                              "x": 112,
                              "y": 24
                          },
                          {
                              "x": 951,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "13 A/1 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 54,
                          "y": 296
                      },
                      {
                          "x": 119,
                          "y": 296
                      },
                      {
                          "x": 119,
                          "y": 318
                      },
                      {
                          "x": 54,
                          "y": 318
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "13",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 54,
                              "y": 296
                          },
                          {
                              "x": 29,
                              "y": 296
                          },
                          {
                              "x": 29,
                              "y": 22
                          },
                          {
                              "x": 54,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "A/1",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 82,
                              "y": 296
                          },
                          {
                              "x": 37,
                              "y": 296
                          },
                          {
                              "x": 37,
                              "y": 22
                          },
                          {
                              "x": 82,
                              "y": 22
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "13 A/1 POS ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 868,
                          "y": 293
                      },
                      {
                          "x": 918,
                          "y": 293
                      },
                      {
                          "x": 918,
                          "y": 318
                      },
                      {
                          "x": 868,
                          "y": 318
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "POS",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 868,
                              "y": 293
                          },
                          {
                              "x": 50,
                              "y": 293
                          },
                          {
                              "x": 50,
                              "y": 25
                          },
                          {
                              "x": 868,
                              "y": 25
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "- I 36 I Telangana ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 943,
                          "y": 302
                      },
                      {
                          "x": 1102,
                          "y": 302
                      },
                      {
                          "x": 1102,
                          "y": 322
                      },
                      {
                          "x": 943,
                          "y": 322
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "-",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 943,
                              "y": 302
                          },
                          {
                              "x": 3,
                              "y": 302
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 943,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 943,
                              "y": 310
                          },
                          {
                              "x": 3,
                              "y": 310
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 943,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "36",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 951,
                              "y": 293
                          },
                          {
                              "x": 29,
                              "y": 293
                          },
                          {
                              "x": 29,
                              "y": 25
                          },
                          {
                              "x": 951,
                              "y": 25
                          }
                      ]
                  }
              },
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 984,
                              "y": 306
                          },
                          {
                              "x": 6,
                              "y": 306
                          },
                          {
                              "x": 6,
                              "y": 3
                          },
                          {
                              "x": 984,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "Telangana",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 994,
                              "y": 292
                          },
                          {
                              "x": 108,
                              "y": 292
                          },
                          {
                              "x": 108,
                              "y": 30
                          },
                          {
                              "x": 994,
                              "y": 30
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "NEAR NAVATA TRANSPORT ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 54,
                          "y": 317
                      },
                      {
                          "x": 349,
                          "y": 317
                      },
                      {
                          "x": 349,
                          "y": 341
                      },
                      {
                          "x": 54,
                          "y": 341
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "NEAR",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 54,
                              "y": 317
                          },
                          {
                              "x": 63,
                              "y": 317
                          },
                          {
                              "x": 63,
                              "y": 24
                          },
                          {
                              "x": 54,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "NAVATA",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 118,
                              "y": 317
                          },
                          {
                              "x": 91,
                              "y": 317
                          },
                          {
                              "x": 91,
                              "y": 24
                          },
                          {
                              "x": 118,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "TRANSPORT",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 213,
                              "y": 317
                          },
                          {
                              "x": 136,
                              "y": 317
                          },
                          {
                              "x": 136,
                              "y": 24
                          },
                          {
                              "x": 213,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "ROAD NO.9, ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 54,
                          "y": 342
                      },
                      {
                          "x": 181,
                          "y": 342
                      },
                      {
                          "x": 181,
                          "y": 367
                      },
                      {
                          "x": 54,
                          "y": 367
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "ROAD",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 54,
                              "y": 342
                          },
                          {
                              "x": 65,
                              "y": 342
                          },
                          {
                              "x": 65,
                              "y": 22
                          },
                          {
                              "x": 54,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "NO.9,",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 123,
                              "y": 345
                          },
                          {
                              "x": 58,
                              "y": 345
                          },
                          {
                              "x": 58,
                              "y": 22
                          },
                          {
                              "x": 123,
                              "y": 22
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "NACHARMA HYDERABAD ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 54,
                          "y": 363
                      },
                      {
                          "x": 328,
                          "y": 363
                      },
                      {
                          "x": 328,
                          "y": 387
                      },
                      {
                          "x": 54,
                          "y": 387
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "NACHARMA",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 54,
                              "y": 363
                          },
                          {
                              "x": 127,
                              "y": 363
                          },
                          {
                              "x": 127,
                              "y": 24
                          },
                          {
                              "x": 54,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "HYDERABAD",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 190,
                              "y": 363
                          },
                          {
                              "x": 138,
                              "y": 363
                          },
                          {
                              "x": 138,
                              "y": 24
                          },
                          {
                              "x": 190,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "TELANGANA PIN I I 500076 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 54,
                          "y": 389
                      },
                      {
                          "x": 320,
                          "y": 389
                      },
                      {
                          "x": 320,
                          "y": 410
                      },
                      {
                          "x": 54,
                          "y": 410
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "TELANGANA",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 54,
                              "y": 389
                          },
                          {
                              "x": 135,
                              "y": 389
                          },
                          {
                              "x": 135,
                              "y": 21
                          },
                          {
                              "x": 54,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": "PIN",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 190,
                              "y": 389
                          },
                          {
                              "x": 40,
                              "y": 389
                          },
                          {
                              "x": 40,
                              "y": 21
                          },
                          {
                              "x": 190,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 237,
                              "y": 397
                          },
                          {
                              "x": 3,
                              "y": 397
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 237,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 237,
                              "y": 405
                          },
                          {
                              "x": 3,
                              "y": 405
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 237,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "500076",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 247,
                              "y": 389
                          },
                          {
                              "x": 73,
                              "y": 389
                          },
                          {
                              "x": 73,
                              "y": 21
                          },
                          {
                              "x": 247,
                              "y": 21
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "GSTIN I I 36AAJCADO72C1Z6 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 54,
                          "y": 412
                      },
                      {
                          "x": 336,
                          "y": 412
                      },
                      {
                          "x": 336,
                          "y": 436
                      },
                      {
                          "x": 54,
                          "y": 436
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "GSTIN",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 54,
                              "y": 412
                          },
                          {
                              "x": 68,
                              "y": 412
                          },
                          {
                              "x": 68,
                              "y": 24
                          },
                          {
                              "x": 54,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 127,
                              "y": 421
                          },
                          {
                              "x": 3,
                              "y": 421
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 127,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 127,
                              "y": 429
                          },
                          {
                              "x": 3,
                              "y": 429
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 127,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "36AAJCADO72C1Z6",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 136,
                              "y": 412
                          },
                          {
                              "x": 200,
                              "y": 412
                          },
                          {
                              "x": 200,
                              "y": 24
                          },
                          {
                              "x": 136,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "STATE CODE I I 36 - Telangana ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 54,
                          "y": 435
                      },
                      {
                          "x": 359,
                          "y": 435
                      },
                      {
                          "x": 359,
                          "y": 463
                      },
                      {
                          "x": 54,
                          "y": 463
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "STATE",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 54,
                              "y": 435
                          },
                          {
                              "x": 73,
                              "y": 435
                          },
                          {
                              "x": 73,
                              "y": 24
                          },
                          {
                              "x": 54,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "CODE",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 128,
                              "y": 435
                          },
                          {
                              "x": 66,
                              "y": 435
                          },
                          {
                              "x": 66,
                              "y": 24
                          },
                          {
                              "x": 128,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 199,
                              "y": 444
                          },
                          {
                              "x": 3,
                              "y": 444
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 199,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 199,
                              "y": 452
                          },
                          {
                              "x": 3,
                              "y": 452
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 199,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "36",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 208,
                              "y": 435
                          },
                          {
                              "x": 30,
                              "y": 435
                          },
                          {
                              "x": 30,
                              "y": 24
                          },
                          {
                              "x": 208,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "-",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 240,
                              "y": 448
                          },
                          {
                              "x": 6,
                              "y": 448
                          },
                          {
                              "x": 6,
                              "y": 3
                          },
                          {
                              "x": 240,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "Telangana",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 249,
                              "y": 435
                          },
                          {
                              "x": 110,
                              "y": 435
                          },
                          {
                              "x": 110,
                              "y": 28
                          },
                          {
                              "x": 249,
                              "y": 28
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "PAN No. I I AAJCAOO72C ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 54,
                          "y": 461
                      },
                      {
                          "x": 294,
                          "y": 461
                      },
                      {
                          "x": 294,
                          "y": 483
                      },
                      {
                          "x": 54,
                          "y": 483
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "PAN",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 54,
                              "y": 461
                          },
                          {
                              "x": 47,
                              "y": 461
                          },
                          {
                              "x": 47,
                              "y": 22
                          },
                          {
                              "x": 54,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "No.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 105,
                              "y": 464
                          },
                          {
                              "x": 37,
                              "y": 464
                          },
                          {
                              "x": 37,
                              "y": 19
                          },
                          {
                              "x": 105,
                              "y": 19
                          }
                      ]
                  }
              },
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 147,
                              "y": 468
                          },
                          {
                              "x": 3,
                              "y": 468
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 147,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 147,
                              "y": 476
                          },
                          {
                              "x": 3,
                              "y": 476
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 147,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "AAJCAOO72C",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 157,
                              "y": 458
                          },
                          {
                              "x": 137,
                              "y": 458
                          },
                          {
                              "x": 137,
                              "y": 25
                          },
                          {
                              "x": 157,
                              "y": 25
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "Product ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 56,
                          "y": 510
                      },
                      {
                          "x": 140,
                          "y": 510
                      },
                      {
                          "x": 140,
                          "y": 529
                      },
                      {
                          "x": 56,
                          "y": 529
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "Product",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 56,
                              "y": 510
                          },
                          {
                              "x": 84,
                              "y": 510
                          },
                          {
                              "x": 84,
                              "y": 19
                          },
                          {
                              "x": 56,
                              "y": 19
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "I I CHANDRIKA SOAP ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 216,
                          "y": 515
                      },
                      {
                          "x": 421,
                          "y": 515
                      },
                      {
                          "x": 421,
                          "y": 529
                      },
                      {
                          "x": 216,
                          "y": 529
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 216,
                              "y": 515
                          },
                          {
                              "x": 3,
                              "y": 515
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 216,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 216,
                              "y": 523
                          },
                          {
                              "x": 3,
                              "y": 523
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 216,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "CHANDRIKA",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 226,
                              "y": 505
                          },
                          {
                              "x": 128,
                              "y": 505
                          },
                          {
                              "x": 128,
                              "y": 24
                          },
                          {
                              "x": 226,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "SOAP",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 358,
                              "y": 505
                          },
                          {
                              "x": 63,
                              "y": 505
                          },
                          {
                              "x": 63,
                              "y": 24
                          },
                          {
                              "x": 358,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "Campaign ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 55,
                          "y": 530
                      },
                      {
                          "x": 161,
                          "y": 530
                      },
                      {
                          "x": 161,
                          "y": 558
                      },
                      {
                          "x": 55,
                          "y": 558
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "Campaign",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 55,
                              "y": 530
                          },
                          {
                              "x": 106,
                              "y": 530
                          },
                          {
                              "x": 106,
                              "y": 28
                          },
                          {
                              "x": 55,
                              "y": 28
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "Campaign I I CHGI EMINIMOVI ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 216,
                          "y": 539
                      },
                      {
                          "x": 390,
                          "y": 539
                      },
                      {
                          "x": 390,
                          "y": 555
                      },
                      {
                          "x": 216,
                          "y": 555
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 216,
                              "y": 539
                          },
                          {
                              "x": 3,
                              "y": 539
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 216,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 216,
                              "y": 547
                          },
                          {
                              "x": 3,
                              "y": 547
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 216,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "CHGI",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 226,
                              "y": 531
                          },
                          {
                              "x": 50,
                              "y": 531
                          },
                          {
                              "x": 50,
                              "y": 24
                          },
                          {
                              "x": 226,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "EMINIMOVI",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 273,
                              "y": 531
                          },
                          {
                              "x": 117,
                              "y": 531
                          },
                          {
                              "x": 117,
                              "y": 24
                          },
                          {
                              "x": 273,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "Campaign I I CHGI EMINIMOVI P, 0. No. ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 729,
                          "y": 533
                      },
                      {
                          "x": 815,
                          "y": 533
                      },
                      {
                          "x": 815,
                          "y": 555
                      },
                      {
                          "x": 729,
                          "y": 555
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "P,",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 729,
                              "y": 533
                          },
                          {
                              "x": 24,
                              "y": 533
                          },
                          {
                              "x": 24,
                              "y": 19
                          },
                          {
                              "x": 729,
                              "y": 19
                          }
                      ]
                  }
              },
              {
                  "word_description": "0.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 755,
                              "y": 533
                          },
                          {
                              "x": 22,
                              "y": 533
                          },
                          {
                              "x": 22,
                              "y": 22
                          },
                          {
                              "x": 755,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "No.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 783,
                              "y": 531
                          },
                          {
                              "x": 32,
                              "y": 531
                          },
                          {
                              "x": 32,
                              "y": 24
                          },
                          {
                              "x": 783,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "it it TEL ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 874,
                          "y": 539
                      },
                      {
                          "x": 926,
                          "y": 539
                      },
                      {
                          "x": 926,
                          "y": 555
                      },
                      {
                          "x": 874,
                          "y": 555
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "it",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 874,
                              "y": 539
                          },
                          {
                              "x": 3,
                              "y": 539
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 874,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "it",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 874,
                              "y": 547
                          },
                          {
                              "x": 3,
                              "y": 547
                          },
                          {
                              "x": 3,
                              "y": 3
                          },
                          {
                              "x": 874,
                              "y": 3
                          }
                      ]
                  }
              },
              {
                  "word_description": "TEL",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 881,
                              "y": 531
                          },
                          {
                              "x": 45,
                              "y": 531
                          },
                          {
                              "x": 45,
                              "y": 24
                          },
                          {
                              "x": 881,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "Ref. our Est. SS1100219-20TEL Date 23.10. 2019 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 54,
                          "y": 554
                      },
                      {
                          "x": 537,
                          "y": 554
                      },
                      {
                          "x": 537,
                          "y": 578
                      },
                      {
                          "x": 54,
                          "y": 578
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "Ref.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 54,
                              "y": 554
                          },
                          {
                              "x": 39,
                              "y": 554
                          },
                          {
                              "x": 39,
                              "y": 24
                          },
                          {
                              "x": 54,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "our",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 100,
                              "y": 559
                          },
                          {
                              "x": 37,
                              "y": 559
                          },
                          {
                              "x": 37,
                              "y": 19
                          },
                          {
                              "x": 100,
                              "y": 19
                          }
                      ]
                  }
              },
              {
                  "word_description": "Est.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 141,
                              "y": 556
                          },
                          {
                              "x": 37,
                              "y": 556
                          },
                          {
                              "x": 37,
                              "y": 22
                          },
                          {
                              "x": 141,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "SS1100219-20TEL",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 183,
                              "y": 554
                          },
                          {
                              "x": 191,
                              "y": 554
                          },
                          {
                              "x": 191,
                              "y": 24
                          },
                          {
                              "x": 183,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "Date",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 376,
                              "y": 554
                          },
                          {
                              "x": 50,
                              "y": 554
                          },
                          {
                              "x": 50,
                              "y": 24
                          },
                          {
                              "x": 376,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "23.10.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 427,
                              "y": 554
                          },
                          {
                              "x": 61,
                              "y": 554
                          },
                          {
                              "x": 61,
                              "y": 24
                          },
                          {
                              "x": 427,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 487,
                              "y": 554
                          },
                          {
                              "x": 50,
                              "y": 554
                          },
                          {
                              "x": 50,
                              "y": 24
                          },
                          {
                              "x": 487,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "Channel ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 56,
                          "y": 605
                      },
                      {
                          "x": 140,
                          "y": 605
                      },
                      {
                          "x": 140,
                          "y": 624
                      },
                      {
                          "x": 56,
                          "y": 624
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "Channel",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 56,
                              "y": 605
                          },
                          {
                              "x": 84,
                              "y": 605
                          },
                          {
                              "x": 84,
                              "y": 19
                          },
                          {
                              "x": 56,
                              "y": 19
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "Channel Dur Telecast ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 427,
                          "y": 605
                      },
                      {
                          "x": 557,
                          "y": 605
                      },
                      {
                          "x": 557,
                          "y": 624
                      },
                      {
                          "x": 427,
                          "y": 624
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "Dur",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 427,
                              "y": 605
                          },
                          {
                              "x": 38,
                              "y": 605
                          },
                          {
                              "x": 38,
                              "y": 19
                          },
                          {
                              "x": 427,
                              "y": 19
                          }
                      ]
                  }
              },
              {
                  "word_description": "Telecast",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 471,
                              "y": 605
                          },
                          {
                              "x": 86,
                              "y": 605
                          },
                          {
                              "x": 86,
                              "y": 19
                          },
                          {
                              "x": 471,
                              "y": 19
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "Channel Dur Telecast Date ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 567,
                          "y": 605
                      },
                      {
                          "x": 614,
                          "y": 605
                      },
                      {
                          "x": 614,
                          "y": 624
                      },
                      {
                          "x": 567,
                          "y": 624
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "Date",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 567,
                              "y": 605
                          },
                          {
                              "x": 47,
                              "y": 605
                          },
                          {
                              "x": 47,
                              "y": 19
                          },
                          {
                              "x": 567,
                              "y": 19
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "Channel Dur Telecast Date Ratel ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 742,
                          "y": 605
                      },
                      {
                          "x": 802,
                          "y": 605
                      },
                      {
                          "x": 802,
                          "y": 624
                      },
                      {
                          "x": 742,
                          "y": 624
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "Ratel",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 742,
                              "y": 605
                          },
                          {
                              "x": 60,
                              "y": 605
                          },
                          {
                              "x": 60,
                              "y": 19
                          },
                          {
                              "x": 742,
                              "y": 19
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "Channel Dur Telecast Date Ratel Cost (`) ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 959,
                          "y": 603
                      },
                      {
                          "x": 1042,
                          "y": 603
                      },
                      {
                          "x": 1042,
                          "y": 627
                      },
                      {
                          "x": 959,
                          "y": 627
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "Cost",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 959,
                              "y": 603
                          },
                          {
                              "x": 50,
                              "y": 603
                          },
                          {
                              "x": 50,
                              "y": 21
                          },
                          {
                              "x": 959,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": "(`)",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1013,
                              "y": 600
                          },
                          {
                              "x": 29,
                              "y": 600
                          },
                          {
                              "x": 29,
                              "y": 27
                          },
                          {
                              "x": 1013,
                              "y": 27
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "Amount ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 1087,
                          "y": 605
                      },
                      {
                          "x": 1168,
                          "y": 605
                      },
                      {
                          "x": 1168,
                          "y": 624
                      },
                      {
                          "x": 1087,
                          "y": 624
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "Amount",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1087,
                              "y": 605
                          },
                          {
                              "x": 81,
                              "y": 605
                          },
                          {
                              "x": 81,
                              "y": 19
                          },
                          {
                              "x": 1087,
                              "y": 19
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "Program ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 55,
                          "y": 628
                      },
                      {
                          "x": 146,
                          "y": 628
                      },
                      {
                          "x": 146,
                          "y": 655
                      },
                      {
                          "x": 55,
                          "y": 655
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "Program",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 55,
                              "y": 628
                          },
                          {
                              "x": 91,
                              "y": 628
                          },
                          {
                              "x": 91,
                              "y": 27
                          },
                          {
                              "x": 55,
                              "y": 27
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "Program Sec Premium/ DOS concrot a ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 427,
                          "y": 629
                      },
                      {
                          "x": 685,
                          "y": 629
                      },
                      {
                          "x": 685,
                          "y": 645
                      },
                      {
                          "x": 427,
                          "y": 645
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "Sec",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 427,
                              "y": 629
                          },
                          {
                              "x": 38,
                              "y": 629
                          },
                          {
                              "x": 38,
                              "y": 21
                          },
                          {
                              "x": 427,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": "Premium/",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 474,
                              "y": 629
                          },
                          {
                              "x": 101,
                              "y": 629
                          },
                          {
                              "x": 101,
                              "y": 19
                          },
                          {
                              "x": 474,
                              "y": 19
                          }
                      ]
                  }
              },
              {
                  "word_description": "DOS",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 580,
                              "y": 629
                          },
                          {
                              "x": 32,
                              "y": 629
                          },
                          {
                              "x": 32,
                              "y": 19
                          },
                          {
                              "x": 580,
                              "y": 19
                          }
                      ]
                  }
              },
              {
                  "word_description": "concrot",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 608,
                              "y": 631
                          },
                          {
                              "x": 60,
                              "y": 631
                          },
                          {
                              "x": 60,
                              "y": 17
                          },
                          {
                              "x": 608,
                              "y": 17
                          }
                      ]
                  }
              },
              {
                  "word_description": "a",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 676,
                              "y": 631
                          },
                          {
                              "x": 9,
                              "y": 631
                          },
                          {
                              "x": 9,
                              "y": 14
                          },
                          {
                              "x": 676,
                              "y": 14
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "Program Sec Premium/ DOS concrot a ( ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 1151,
                          "y": 628
                      },
                      {
                          "x": 1156,
                          "y": 628
                      },
                      {
                          "x": 1156,
                          "y": 649
                      },
                      {
                          "x": 1151,
                          "y": 649
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "(",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1151,
                              "y": 628
                          },
                          {
                              "x": 5,
                              "y": 628
                          },
                          {
                              "x": 5,
                              "y": 21
                          },
                          {
                              "x": 1151,
                              "y": 21
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "> ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 1167,
                          "y": 628
                      },
                      {
                          "x": 1172,
                          "y": 628
                      },
                      {
                          "x": 1172,
                          "y": 648
                      },
                      {
                          "x": 1167,
                          "y": 648
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": ">",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1167,
                              "y": 628
                          },
                          {
                              "x": 5,
                              "y": 628
                          },
                          {
                              "x": 5,
                              "y": 20
                          },
                          {
                              "x": 1167,
                              "y": 20
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "GEMINI MOVIES ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 54,
                          "y": 672
                      },
                      {
                          "x": 220,
                          "y": 672
                      },
                      {
                          "x": 220,
                          "y": 694
                      },
                      {
                          "x": 54,
                          "y": 694
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "GEMINI",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 54,
                              "y": 672
                          },
                          {
                              "x": 78,
                              "y": 672
                          },
                          {
                              "x": 78,
                              "y": 22
                          },
                          {
                              "x": 54,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "MOVIES",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 134,
                              "y": 670
                          },
                          {
                              "x": 86,
                              "y": 670
                          },
                          {
                              "x": 86,
                              "y": 24
                          },
                          {
                              "x": 134,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "GEMINI MOVIES BIF ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 708,
                          "y": 672
                      },
                      {
                          "x": 740,
                          "y": 672
                      },
                      {
                          "x": 740,
                          "y": 694
                      },
                      {
                          "x": 708,
                          "y": 694
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "BIF",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 708,
                              "y": 672
                          },
                          {
                              "x": 32,
                              "y": 672
                          },
                          {
                              "x": 32,
                              "y": 22
                          },
                          {
                              "x": 708,
                              "y": 22
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "1,06, 590.00 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 770,
                          "y": 672
                      },
                      {
                          "x": 867,
                          "y": 672
                      },
                      {
                          "x": 867,
                          "y": 694
                      },
                      {
                          "x": 770,
                          "y": 694
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "1,06,",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 770,
                              "y": 672
                          },
                          {
                              "x": 43,
                              "y": 672
                          },
                          {
                              "x": 43,
                              "y": 25
                          },
                          {
                              "x": 770,
                              "y": 25
                          }
                      ]
                  }
              },
              {
                  "word_description": "590.00",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 809,
                              "y": 672
                          },
                          {
                              "x": 58,
                              "y": 672
                          },
                          {
                              "x": 58,
                              "y": 22
                          },
                          {
                              "x": 809,
                              "y": 22
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 425,
                          "y": 696
                      },
                      {
                          "x": 449,
                          "y": 696
                      },
                      {
                          "x": 449,
                          "y": 717
                      },
                      {
                          "x": 425,
                          "y": 717
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "10",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 425,
                              "y": 696
                          },
                          {
                              "x": 24,
                              "y": 696
                          },
                          {
                              "x": 24,
                              "y": 21
                          },
                          {
                              "x": 425,
                              "y": 21
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 25. 10.2019 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 469,
                          "y": 696
                      },
                      {
                          "x": 563,
                          "y": 696
                      },
                      {
                          "x": 563,
                          "y": 720
                      },
                      {
                          "x": 469,
                          "y": 720
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "25.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 696
                          },
                          {
                              "x": 27,
                              "y": 696
                          },
                          {
                              "x": 27,
                              "y": 24
                          },
                          {
                              "x": 469,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 495,
                              "y": 696
                          },
                          {
                              "x": 68,
                              "y": 696
                          },
                          {
                              "x": 68,
                              "y": 24
                          },
                          {
                              "x": 495,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 25. 10.2019 807 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 853,
                          "y": 696
                      },
                      {
                          "x": 911,
                          "y": 696
                      },
                      {
                          "x": 911,
                          "y": 720
                      },
                      {
                          "x": 853,
                          "y": 720
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 853,
                              "y": 696
                          },
                          {
                              "x": 34,
                              "y": 696
                          },
                          {
                              "x": 34,
                              "y": 21
                          },
                          {
                              "x": 853,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 696
                          },
                          {
                              "x": 25,
                              "y": 696
                          },
                          {
                              "x": 25,
                              "y": 24
                          },
                          {
                              "x": 886,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 25. 10.2019 807 50 807. 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 995,
                          "y": 696
                      },
                      {
                          "x": 1052,
                          "y": 696
                      },
                      {
                          "x": 1052,
                          "y": 720
                      },
                      {
                          "x": 995,
                          "y": 720
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 696
                          },
                          {
                              "x": 34,
                              "y": 696
                          },
                          {
                              "x": 34,
                              "y": 24
                          },
                          {
                              "x": 995,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1028,
                              "y": 696
                          },
                          {
                              "x": 24,
                              "y": 696
                          },
                          {
                              "x": 24,
                              "y": 24
                          },
                          {
                              "x": 1028,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "807 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 1118,
                          "y": 696
                      },
                      {
                          "x": 1176,
                          "y": 696
                      },
                      {
                          "x": 1176,
                          "y": 720
                      },
                      {
                          "x": 1118,
                          "y": 720
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1118,
                              "y": 696
                          },
                          {
                              "x": 35,
                              "y": 696
                          },
                          {
                              "x": 35,
                              "y": 24
                          },
                          {
                              "x": 1118,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1152,
                              "y": 696
                          },
                          {
                              "x": 24,
                              "y": 696
                          },
                          {
                              "x": 24,
                              "y": 24
                          },
                          {
                              "x": 1152,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 425,
                          "y": 719
                      },
                      {
                          "x": 449,
                          "y": 719
                      },
                      {
                          "x": 449,
                          "y": 743
                      },
                      {
                          "x": 425,
                          "y": 743
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "10",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 425,
                              "y": 719
                          },
                          {
                              "x": 24,
                              "y": 719
                          },
                          {
                              "x": 24,
                              "y": 24
                          },
                          {
                              "x": 425,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 25. .10.2019 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 469,
                          "y": 719
                      },
                      {
                          "x": 563,
                          "y": 719
                      },
                      {
                          "x": 563,
                          "y": 743
                      },
                      {
                          "x": 469,
                          "y": 743
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "25.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 719
                          },
                          {
                              "x": 27,
                              "y": 719
                          },
                          {
                              "x": 27,
                              "y": 24
                          },
                          {
                              "x": 469,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": ".10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 492,
                              "y": 719
                          },
                          {
                              "x": 71,
                              "y": 719
                          },
                          {
                              "x": 71,
                              "y": 24
                          },
                          {
                              "x": 492,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 25. .10.2019 807 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 853,
                          "y": 721
                      },
                      {
                          "x": 911,
                          "y": 721
                      },
                      {
                          "x": 911,
                          "y": 743
                      },
                      {
                          "x": 853,
                          "y": 743
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 853,
                              "y": 721
                          },
                          {
                              "x": 34,
                              "y": 721
                          },
                          {
                              "x": 34,
                              "y": 22
                          },
                          {
                              "x": 853,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 721
                          },
                          {
                              "x": 25,
                              "y": 721
                          },
                          {
                              "x": 25,
                              "y": 22
                          },
                          {
                              "x": 886,
                              "y": 22
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 25. .10.2019 807 50 807. 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 995,
                          "y": 719
                      },
                      {
                          "x": 1052,
                          "y": 719
                      },
                      {
                          "x": 1052,
                          "y": 743
                      },
                      {
                          "x": 995,
                          "y": 743
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 719
                          },
                          {
                              "x": 34,
                              "y": 719
                          },
                          {
                              "x": 34,
                              "y": 24
                          },
                          {
                              "x": 995,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1028,
                              "y": 719
                          },
                          {
                              "x": 24,
                              "y": 719
                          },
                          {
                              "x": 24,
                              "y": 24
                          },
                          {
                              "x": 1028,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "807.50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 1121,
                          "y": 721
                      },
                      {
                          "x": 1176,
                          "y": 721
                      },
                      {
                          "x": 1176,
                          "y": 743
                      },
                      {
                          "x": 1121,
                          "y": 743
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1121,
                              "y": 721
                          },
                          {
                              "x": 55,
                              "y": 721
                          },
                          {
                              "x": 55,
                              "y": 22
                          },
                          {
                              "x": 1121,
                              "y": 22
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 425,
                          "y": 742
                      },
                      {
                          "x": 449,
                          "y": 742
                      },
                      {
                          "x": 449,
                          "y": 766
                      },
                      {
                          "x": 425,
                          "y": 766
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "10",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 425,
                              "y": 742
                          },
                          {
                              "x": 24,
                              "y": 742
                          },
                          {
                              "x": 24,
                              "y": 24
                          },
                          {
                              "x": 425,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 25. .10.2019 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 469,
                          "y": 742
                      },
                      {
                          "x": 563,
                          "y": 742
                      },
                      {
                          "x": 563,
                          "y": 766
                      },
                      {
                          "x": 469,
                          "y": 766
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "25.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 742
                          },
                          {
                              "x": 27,
                              "y": 742
                          },
                          {
                              "x": 27,
                              "y": 24
                          },
                          {
                              "x": 469,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": ".10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 492,
                              "y": 742
                          },
                          {
                              "x": 71,
                              "y": 742
                          },
                          {
                              "x": 71,
                              "y": 24
                          },
                          {
                              "x": 492,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 25. .10.2019 807 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 853,
                          "y": 742
                      },
                      {
                          "x": 911,
                          "y": 742
                      },
                      {
                          "x": 911,
                          "y": 766
                      },
                      {
                          "x": 853,
                          "y": 766
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 853,
                              "y": 742
                          },
                          {
                              "x": 34,
                              "y": 742
                          },
                          {
                              "x": 34,
                              "y": 24
                          },
                          {
                              "x": 853,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 742
                          },
                          {
                              "x": 25,
                              "y": 742
                          },
                          {
                              "x": 25,
                              "y": 24
                          },
                          {
                              "x": 886,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 25. .10.2019 807 50 807. 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 995,
                          "y": 742
                      },
                      {
                          "x": 1052,
                          "y": 742
                      },
                      {
                          "x": 1052,
                          "y": 766
                      },
                      {
                          "x": 995,
                          "y": 766
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 742
                          },
                          {
                              "x": 34,
                              "y": 742
                          },
                          {
                              "x": 34,
                              "y": 24
                          },
                          {
                              "x": 995,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1028,
                              "y": 742
                          },
                          {
                              "x": 24,
                              "y": 742
                          },
                          {
                              "x": 24,
                              "y": 24
                          },
                          {
                              "x": 1028,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "807.50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 1121,
                          "y": 745
                      },
                      {
                          "x": 1176,
                          "y": 745
                      },
                      {
                          "x": 1176,
                          "y": 766
                      },
                      {
                          "x": 1121,
                          "y": 766
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1121,
                              "y": 745
                          },
                          {
                              "x": 55,
                              "y": 745
                          },
                          {
                              "x": 55,
                              "y": 21
                          },
                          {
                              "x": 1121,
                              "y": 21
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "I ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 425,
                          "y": 765
                      },
                      {
                          "x": 449,
                          "y": 765
                      },
                      {
                          "x": 449,
                          "y": 885
                      },
                      {
                          "x": 425,
                          "y": 885
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 425,
                              "y": 765
                          },
                          {
                              "x": 24,
                              "y": 765
                          },
                          {
                              "x": 24,
                              "y": 120
                          },
                          {
                              "x": 425,
                              "y": 120
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "I 25. 26. 26. 26. 26. .10.2019 .10.2019 10.2019 10.2019 10.2019 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 469,
                          "y": 768
                      },
                      {
                          "x": 563,
                          "y": 768
                      },
                      {
                          "x": 563,
                          "y": 885
                      },
                      {
                          "x": 469,
                          "y": 885
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "25.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 768
                          },
                          {
                              "x": 27,
                              "y": 768
                          },
                          {
                              "x": 27,
                              "y": 21
                          },
                          {
                              "x": 469,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": "26.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 791
                          },
                          {
                              "x": 27,
                              "y": 791
                          },
                          {
                              "x": 27,
                              "y": 24
                          },
                          {
                              "x": 469,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "26.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 812
                          },
                          {
                              "x": 27,
                              "y": 812
                          },
                          {
                              "x": 27,
                              "y": 26
                          },
                          {
                              "x": 469,
                              "y": 26
                          }
                      ]
                  }
              },
              {
                  "word_description": "26.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 837
                          },
                          {
                              "x": 27,
                              "y": 837
                          },
                          {
                              "x": 27,
                              "y": 25
                          },
                          {
                              "x": 469,
                              "y": 25
                          }
                      ]
                  }
              },
              {
                  "word_description": "26.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 858
                          },
                          {
                              "x": 27,
                              "y": 858
                          },
                          {
                              "x": 27,
                              "y": 27
                          },
                          {
                              "x": 469,
                              "y": 27
                          }
                      ]
                  }
              },
              {
                  "word_description": ".10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 492,
                              "y": 765
                          },
                          {
                              "x": 71,
                              "y": 765
                          },
                          {
                              "x": 71,
                              "y": 24
                          },
                          {
                              "x": 492,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": ".10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 492,
                              "y": 791
                          },
                          {
                              "x": 71,
                              "y": 791
                          },
                          {
                              "x": 71,
                              "y": 24
                          },
                          {
                              "x": 492,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 495,
                              "y": 812
                          },
                          {
                              "x": 68,
                              "y": 812
                          },
                          {
                              "x": 68,
                              "y": 26
                          },
                          {
                              "x": 495,
                              "y": 26
                          }
                      ]
                  }
              },
              {
                  "word_description": "10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 495,
                              "y": 837
                          },
                          {
                              "x": 68,
                              "y": 837
                          },
                          {
                              "x": 68,
                              "y": 25
                          },
                          {
                              "x": 495,
                              "y": 25
                          }
                      ]
                  }
              },
              {
                  "word_description": "10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 495,
                              "y": 861
                          },
                          {
                              "x": 68,
                              "y": 861
                          },
                          {
                              "x": 68,
                              "y": 24
                          },
                          {
                              "x": 495,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "I 25. 26. 26. 26. 26. .10.2019 .10.2019 10.2019 10.2019 10.2019 807 807 807 807 807 50 50 50 50 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 853,
                          "y": 768
                      },
                      {
                          "x": 911,
                          "y": 768
                      },
                      {
                          "x": 911,
                          "y": 885
                      },
                      {
                          "x": 853,
                          "y": 885
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 853,
                              "y": 768
                          },
                          {
                              "x": 34,
                              "y": 768
                          },
                          {
                              "x": 34,
                              "y": 21
                          },
                          {
                              "x": 853,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 853,
                              "y": 791
                          },
                          {
                              "x": 34,
                              "y": 791
                          },
                          {
                              "x": 34,
                              "y": 22
                          },
                          {
                              "x": 853,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 853,
                              "y": 814
                          },
                          {
                              "x": 34,
                              "y": 814
                          },
                          {
                              "x": 34,
                              "y": 22
                          },
                          {
                              "x": 853,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 853,
                              "y": 837
                          },
                          {
                              "x": 34,
                              "y": 837
                          },
                          {
                              "x": 34,
                              "y": 25
                          },
                          {
                              "x": 853,
                              "y": 25
                          }
                      ]
                  }
              },
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 853,
                              "y": 861
                          },
                          {
                              "x": 34,
                              "y": 861
                          },
                          {
                              "x": 34,
                              "y": 21
                          },
                          {
                              "x": 853,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 768
                          },
                          {
                              "x": 25,
                              "y": 768
                          },
                          {
                              "x": 25,
                              "y": 21
                          },
                          {
                              "x": 886,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 791
                          },
                          {
                              "x": 25,
                              "y": 791
                          },
                          {
                              "x": 25,
                              "y": 22
                          },
                          {
                              "x": 886,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 814
                          },
                          {
                              "x": 25,
                              "y": 814
                          },
                          {
                              "x": 25,
                              "y": 22
                          },
                          {
                              "x": 886,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 837
                          },
                          {
                              "x": 25,
                              "y": 837
                          },
                          {
                              "x": 25,
                              "y": 25
                          },
                          {
                              "x": 886,
                              "y": 25
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 861
                          },
                          {
                              "x": 25,
                              "y": 861
                          },
                          {
                              "x": 25,
                              "y": 24
                          },
                          {
                              "x": 886,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "I 25. 26. 26. 26. 26. .10.2019 .10.2019 10.2019 10.2019 10.2019 807 807 807 807 807 50 50 50 50 50 807.50 807. 807. 807. 807. .50 50 50 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 995,
                          "y": 765
                      },
                      {
                          "x": 1052,
                          "y": 765
                      },
                      {
                          "x": 1052,
                          "y": 882
                      },
                      {
                          "x": 995,
                          "y": 882
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 765
                          },
                          {
                              "x": 57,
                              "y": 765
                          },
                          {
                              "x": 57,
                              "y": 24
                          },
                          {
                              "x": 995,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 791
                          },
                          {
                              "x": 34,
                              "y": 791
                          },
                          {
                              "x": 34,
                              "y": 22
                          },
                          {
                              "x": 995,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 814
                          },
                          {
                              "x": 34,
                              "y": 814
                          },
                          {
                              "x": 34,
                              "y": 22
                          },
                          {
                              "x": 995,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 837
                          },
                          {
                              "x": 37,
                              "y": 837
                          },
                          {
                              "x": 37,
                              "y": 25
                          },
                          {
                              "x": 995,
                              "y": 25
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 861
                          },
                          {
                              "x": 37,
                              "y": 861
                          },
                          {
                              "x": 37,
                              "y": 24
                          },
                          {
                              "x": 995,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": ".50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1026,
                              "y": 840
                          },
                          {
                              "x": 26,
                              "y": 840
                          },
                          {
                              "x": 26,
                              "y": 22
                          },
                          {
                              "x": 1026,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1028,
                              "y": 791
                          },
                          {
                              "x": 24,
                              "y": 791
                          },
                          {
                              "x": 24,
                              "y": 24
                          },
                          {
                              "x": 1028,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1028,
                              "y": 812
                          },
                          {
                              "x": 24,
                              "y": 812
                          },
                          {
                              "x": 24,
                              "y": 24
                          },
                          {
                              "x": 1028,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1031,
                              "y": 863
                          },
                          {
                              "x": 21,
                              "y": 863
                          },
                          {
                              "x": 21,
                              "y": 19
                          },
                          {
                              "x": 1031,
                              "y": 19
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "807.50 807.50 807 807.50 807.50 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 1118,
                          "y": 765
                      },
                      {
                          "x": 1176,
                          "y": 765
                      },
                      {
                          "x": 1176,
                          "y": 836
                      },
                      {
                          "x": 1118,
                          "y": 836
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1118,
                              "y": 765
                          },
                          {
                              "x": 58,
                              "y": 765
                          },
                          {
                              "x": 58,
                              "y": 24
                          },
                          {
                              "x": 1118,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1118,
                              "y": 791
                          },
                          {
                              "x": 58,
                              "y": 791
                          },
                          {
                              "x": 58,
                              "y": 24
                          },
                          {
                              "x": 1118,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1118,
                              "y": 812
                          },
                          {
                              "x": 35,
                              "y": 812
                          },
                          {
                              "x": 35,
                              "y": 24
                          },
                          {
                              "x": 1118,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1118,
                              "y": 837
                          },
                          {
                              "x": 58,
                              "y": 837
                          },
                          {
                              "x": 58,
                              "y": 25
                          },
                          {
                              "x": 1118,
                              "y": 25
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1118,
                              "y": 861
                          },
                          {
                              "x": 58,
                              "y": 861
                          },
                          {
                              "x": 58,
                              "y": 21
                          },
                          {
                              "x": 1118,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1155,
                              "y": 814
                          },
                          {
                              "x": 21,
                              "y": 814
                          },
                          {
                              "x": 21,
                              "y": 22
                          },
                          {
                              "x": 1155,
                              "y": 22
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "18 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 425,
                          "y": 881
                      },
                      {
                          "x": 449,
                          "y": 881
                      },
                      {
                          "x": 449,
                          "y": 954
                      },
                      {
                          "x": 425,
                          "y": 954
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "18",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 425,
                              "y": 881
                          },
                          {
                              "x": 24,
                              "y": 881
                          },
                          {
                              "x": 24,
                              "y": 73
                          },
                          {
                              "x": 425,
                              "y": 73
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "18 26. 26. 26. .10.2019 10.2019 10.2019 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 469,
                          "y": 884
                      },
                      {
                          "x": 563,
                          "y": 884
                      },
                      {
                          "x": 563,
                          "y": 954
                      },
                      {
                          "x": 469,
                          "y": 954
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "26.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 884
                          },
                          {
                              "x": 27,
                              "y": 884
                          },
                          {
                              "x": 27,
                              "y": 24
                          },
                          {
                              "x": 469,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "26.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 910
                          },
                          {
                              "x": 27,
                              "y": 910
                          },
                          {
                              "x": 27,
                              "y": 21
                          },
                          {
                              "x": 469,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": "26.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 930
                          },
                          {
                              "x": 27,
                              "y": 930
                          },
                          {
                              "x": 27,
                              "y": 24
                          },
                          {
                              "x": 469,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": ".10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 492,
                              "y": 884
                          },
                          {
                              "x": 71,
                              "y": 884
                          },
                          {
                              "x": 71,
                              "y": 24
                          },
                          {
                              "x": 492,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 495,
                              "y": 907
                          },
                          {
                              "x": 68,
                              "y": 907
                          },
                          {
                              "x": 68,
                              "y": 24
                          },
                          {
                              "x": 495,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 495,
                              "y": 930
                          },
                          {
                              "x": 68,
                              "y": 930
                          },
                          {
                              "x": 68,
                              "y": 24
                          },
                          {
                              "x": 495,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "18 26. 26. 26. .10.2019 10.2019 10.2019 807 807 807 50 50 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 853,
                          "y": 886
                      },
                      {
                          "x": 911,
                          "y": 886
                      },
                      {
                          "x": 911,
                          "y": 908
                      },
                      {
                          "x": 853,
                          "y": 908
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 853,
                              "y": 886
                          },
                          {
                              "x": 34,
                              "y": 886
                          },
                          {
                              "x": 34,
                              "y": 22
                          },
                          {
                              "x": 853,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 853,
                              "y": 910
                          },
                          {
                              "x": 34,
                              "y": 910
                          },
                          {
                              "x": 34,
                              "y": 21
                          },
                          {
                              "x": 853,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 853,
                              "y": 933
                          },
                          {
                              "x": 34,
                              "y": 933
                          },
                          {
                              "x": 34,
                              "y": 21
                          },
                          {
                              "x": 853,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 910
                          },
                          {
                              "x": 25,
                              "y": 910
                          },
                          {
                              "x": 25,
                              "y": 21
                          },
                          {
                              "x": 886,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 933
                          },
                          {
                              "x": 25,
                              "y": 933
                          },
                          {
                              "x": 25,
                              "y": 21
                          },
                          {
                              "x": 886,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 889,
                              "y": 889
                          },
                          {
                              "x": 22,
                              "y": 889
                          },
                          {
                              "x": 22,
                              "y": 19
                          },
                          {
                              "x": 889,
                              "y": 19
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "18 26. 26. 26. .10.2019 10.2019 10.2019 807 807 807 50 50 50 807 807.50 807.50 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 995,
                          "y": 884
                      },
                      {
                          "x": 1052,
                          "y": 884
                      },
                      {
                          "x": 1052,
                          "y": 908
                      },
                      {
                          "x": 995,
                          "y": 908
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 884
                          },
                          {
                              "x": 34,
                              "y": 884
                          },
                          {
                              "x": 34,
                              "y": 24
                          },
                          {
                              "x": 995,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 907
                          },
                          {
                              "x": 57,
                              "y": 907
                          },
                          {
                              "x": 57,
                              "y": 24
                          },
                          {
                              "x": 995,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 930
                          },
                          {
                              "x": 57,
                              "y": 930
                          },
                          {
                              "x": 57,
                              "y": 24
                          },
                          {
                              "x": 995,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1028,
                              "y": 884
                          },
                          {
                              "x": 24,
                              "y": 884
                          },
                          {
                              "x": 24,
                              "y": 24
                          },
                          {
                              "x": 1028,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "807. 807.50 807.50 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 1118,
                          "y": 884
                      },
                      {
                          "x": 1176,
                          "y": 884
                      },
                      {
                          "x": 1176,
                          "y": 908
                      },
                      {
                          "x": 1118,
                          "y": 908
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1118,
                              "y": 884
                          },
                          {
                              "x": 38,
                              "y": 884
                          },
                          {
                              "x": 38,
                              "y": 24
                          },
                          {
                              "x": 1118,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1118,
                              "y": 907
                          },
                          {
                              "x": 58,
                              "y": 907
                          },
                          {
                              "x": 58,
                              "y": 24
                          },
                          {
                              "x": 1118,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1118,
                              "y": 930
                          },
                          {
                              "x": 58,
                              "y": 930
                          },
                          {
                              "x": 58,
                              "y": 24
                          },
                          {
                              "x": 1118,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1152,
                              "y": 884
                          },
                          {
                              "x": 24,
                              "y": 884
                          },
                          {
                              "x": 24,
                              "y": 24
                          },
                          {
                              "x": 1152,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "I ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 425,
                          "y": 953
                      },
                      {
                          "x": 449,
                          "y": 953
                      },
                      {
                          "x": 449,
                          "y": 1073
                      },
                      {
                          "x": 425,
                          "y": 1073
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "I",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 425,
                              "y": 953
                          },
                          {
                              "x": 24,
                              "y": 953
                          },
                          {
                              "x": 24,
                              "y": 120
                          },
                          {
                              "x": 425,
                              "y": 120
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "I 26. 26. 26. 26. 26. .10.2019 .10.2019 10.2019 10.2019 10.2019 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 469,
                          "y": 956
                      },
                      {
                          "x": 563,
                          "y": 956
                      },
                      {
                          "x": 563,
                          "y": 1027
                      },
                      {
                          "x": 469,
                          "y": 1027
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "26.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 956
                          },
                          {
                              "x": 27,
                              "y": 956
                          },
                          {
                              "x": 27,
                              "y": 24
                          },
                          {
                              "x": 469,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "26.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 979
                          },
                          {
                              "x": 27,
                              "y": 979
                          },
                          {
                              "x": 27,
                              "y": 24
                          },
                          {
                              "x": 469,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "26.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 1002
                          },
                          {
                              "x": 27,
                              "y": 1002
                          },
                          {
                              "x": 27,
                              "y": 25
                          },
                          {
                              "x": 469,
                              "y": 25
                          }
                      ]
                  }
              },
              {
                  "word_description": "26.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 1026
                          },
                          {
                              "x": 27,
                              "y": 1026
                          },
                          {
                              "x": 27,
                              "y": 24
                          },
                          {
                              "x": 469,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "26.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 1049
                          },
                          {
                              "x": 27,
                              "y": 1049
                          },
                          {
                              "x": 27,
                              "y": 24
                          },
                          {
                              "x": 469,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": ".10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 492,
                              "y": 1026
                          },
                          {
                              "x": 71,
                              "y": 1026
                          },
                          {
                              "x": 71,
                              "y": 24
                          },
                          {
                              "x": 492,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": ".10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 492,
                              "y": 1049
                          },
                          {
                              "x": 71,
                              "y": 1049
                          },
                          {
                              "x": 71,
                              "y": 24
                          },
                          {
                              "x": 492,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 495,
                              "y": 956
                          },
                          {
                              "x": 68,
                              "y": 956
                          },
                          {
                              "x": 68,
                              "y": 24
                          },
                          {
                              "x": 495,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 495,
                              "y": 977
                          },
                          {
                              "x": 68,
                              "y": 977
                          },
                          {
                              "x": 68,
                              "y": 26
                          },
                          {
                              "x": 495,
                              "y": 26
                          }
                      ]
                  }
              },
              {
                  "word_description": "10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 495,
                              "y": 1002
                          },
                          {
                              "x": 68,
                              "y": 1002
                          },
                          {
                              "x": 68,
                              "y": 25
                          },
                          {
                              "x": 495,
                              "y": 25
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "I 26. 26. 26. 26. 26. .10.2019 .10.2019 10.2019 10.2019 10.2019 807 807 807 807. 807. 50 50 50 50 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 853,
                          "y": 956
                      },
                      {
                          "x": 911,
                          "y": 956
                      },
                      {
                          "x": 911,
                          "y": 1073
                      },
                      {
                          "x": 853,
                          "y": 1073
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 853,
                              "y": 956
                          },
                          {
                              "x": 34,
                              "y": 956
                          },
                          {
                              "x": 34,
                              "y": 22
                          },
                          {
                              "x": 853,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 853,
                              "y": 979
                          },
                          {
                              "x": 32,
                              "y": 979
                          },
                          {
                              "x": 32,
                              "y": 24
                          },
                          {
                              "x": 853,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 853,
                              "y": 1049
                          },
                          {
                              "x": 32,
                              "y": 1049
                          },
                          {
                              "x": 32,
                              "y": 24
                          },
                          {
                              "x": 853,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 855,
                              "y": 1005
                          },
                          {
                              "x": 32,
                              "y": 1005
                          },
                          {
                              "x": 32,
                              "y": 19
                          },
                          {
                              "x": 855,
                              "y": 19
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 855,
                              "y": 1031
                          },
                          {
                              "x": 32,
                              "y": 1031
                          },
                          {
                              "x": 32,
                              "y": 19
                          },
                          {
                              "x": 855,
                              "y": 19
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 956
                          },
                          {
                              "x": 25,
                              "y": 956
                          },
                          {
                              "x": 25,
                              "y": 22
                          },
                          {
                              "x": 886,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 979
                          },
                          {
                              "x": 25,
                              "y": 979
                          },
                          {
                              "x": 25,
                              "y": 24
                          },
                          {
                              "x": 886,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 1002
                          },
                          {
                              "x": 25,
                              "y": 1002
                          },
                          {
                              "x": 25,
                              "y": 25
                          },
                          {
                              "x": 886,
                              "y": 25
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 1028
                          },
                          {
                              "x": 25,
                              "y": 1028
                          },
                          {
                              "x": 25,
                              "y": 22
                          },
                          {
                              "x": 886,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 1049
                          },
                          {
                              "x": 25,
                              "y": 1049
                          },
                          {
                              "x": 25,
                              "y": 24
                          },
                          {
                              "x": 886,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "I 26. 26. 26. 26. 26. .10.2019 .10.2019 10.2019 10.2019 10.2019 807 807 807 807. 807. 50 50 50 50 50 807 807 807 807. 807 50 50 50 50 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 995,
                          "y": 956
                      },
                      {
                          "x": 1052,
                          "y": 956
                      },
                      {
                          "x": 1052,
                          "y": 978
                      },
                      {
                          "x": 995,
                          "y": 978
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 956
                          },
                          {
                              "x": 34,
                              "y": 956
                          },
                          {
                              "x": 34,
                              "y": 22
                          },
                          {
                              "x": 995,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 979
                          },
                          {
                              "x": 34,
                              "y": 979
                          },
                          {
                              "x": 34,
                              "y": 24
                          },
                          {
                              "x": 995,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 1002
                          },
                          {
                              "x": 34,
                              "y": 1002
                          },
                          {
                              "x": 34,
                              "y": 25
                          },
                          {
                              "x": 995,
                              "y": 25
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 1028
                          },
                          {
                              "x": 34,
                              "y": 1028
                          },
                          {
                              "x": 34,
                              "y": 22
                          },
                          {
                              "x": 995,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "807",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 1049
                          },
                          {
                              "x": 34,
                              "y": 1049
                          },
                          {
                              "x": 34,
                              "y": 24
                          },
                          {
                              "x": 995,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1028,
                              "y": 979
                          },
                          {
                              "x": 24,
                              "y": 979
                          },
                          {
                              "x": 24,
                              "y": 24
                          },
                          {
                              "x": 1028,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1028,
                              "y": 1002
                          },
                          {
                              "x": 24,
                              "y": 1002
                          },
                          {
                              "x": 24,
                              "y": 22
                          },
                          {
                              "x": 1028,
                              "y": 22
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1028,
                              "y": 1026
                          },
                          {
                              "x": 24,
                              "y": 1026
                          },
                          {
                              "x": 24,
                              "y": 24
                          },
                          {
                              "x": 1028,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1028,
                              "y": 1049
                          },
                          {
                              "x": 24,
                              "y": 1049
                          },
                          {
                              "x": 24,
                              "y": 24
                          },
                          {
                              "x": 1028,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1031,
                              "y": 959
                          },
                          {
                              "x": 21,
                              "y": 959
                          },
                          {
                              "x": 21,
                              "y": 19
                          },
                          {
                              "x": 1031,
                              "y": 19
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "807.50 807.50 807.50 807.50 807.50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 1118,
                          "y": 979
                      },
                      {
                          "x": 1176,
                          "y": 979
                      },
                      {
                          "x": 1176,
                          "y": 978
                      },
                      {
                          "x": 1118,
                          "y": 978
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1118,
                              "y": 979
                          },
                          {
                              "x": 58,
                              "y": 979
                          },
                          {
                              "x": 58,
                              "y": 24
                          },
                          {
                              "x": 1118,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1118,
                              "y": 1002
                          },
                          {
                              "x": 58,
                              "y": 1002
                          },
                          {
                              "x": 58,
                              "y": 25
                          },
                          {
                              "x": 1118,
                              "y": 25
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1118,
                              "y": 1026
                          },
                          {
                              "x": 58,
                              "y": 1026
                          },
                          {
                              "x": 58,
                              "y": 24
                          },
                          {
                              "x": 1118,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1118,
                              "y": 1049
                          },
                          {
                              "x": 58,
                              "y": 1049
                          },
                          {
                              "x": 58,
                              "y": 24
                          },
                          {
                              "x": 1118,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1121,
                              "y": 959
                          },
                          {
                              "x": 55,
                              "y": 959
                          },
                          {
                              "x": 55,
                              "y": 19
                          },
                          {
                              "x": 1121,
                              "y": 19
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 425,
                          "y": 1072
                      },
                      {
                          "x": 449,
                          "y": 1072
                      },
                      {
                          "x": 449,
                          "y": 1096
                      },
                      {
                          "x": 425,
                          "y": 1096
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "10",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 425,
                              "y": 1072
                          },
                          {
                              "x": 24,
                              "y": 1072
                          },
                          {
                              "x": 24,
                              "y": 24
                          },
                          {
                              "x": 425,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 26. .10.2019 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 469,
                          "y": 1075
                      },
                      {
                          "x": 563,
                          "y": 1075
                      },
                      {
                          "x": 563,
                          "y": 1096
                      },
                      {
                          "x": 469,
                          "y": 1096
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "26.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 469,
                              "y": 1075
                          },
                          {
                              "x": 27,
                              "y": 1075
                          },
                          {
                              "x": 27,
                              "y": 21
                          },
                          {
                              "x": 469,
                              "y": 21
                          }
                      ]
                  }
              },
              {
                  "word_description": ".10.2019",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 492,
                              "y": 1072
                          },
                          {
                              "x": 71,
                              "y": 1072
                          },
                          {
                              "x": 71,
                              "y": 24
                          },
                          {
                              "x": 492,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 26. .10.2019 807.5 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 855,
                          "y": 1077
                      },
                      {
                          "x": 911,
                          "y": 1077
                      },
                      {
                          "x": 911,
                          "y": 1096
                      },
                      {
                          "x": 855,
                          "y": 1096
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807.5",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 855,
                              "y": 1077
                          },
                          {
                              "x": 38,
                              "y": 1077
                          },
                          {
                              "x": 38,
                              "y": 19
                          },
                          {
                              "x": 855,
                              "y": 19
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 886,
                              "y": 1075
                          },
                          {
                              "x": 25,
                              "y": 1075
                          },
                          {
                              "x": 25,
                              "y": 21
                          },
                          {
                              "x": 886,
                              "y": 21
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "10 26. .10.2019 807.5 50 807.50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 995,
                          "y": 1072
                      },
                      {
                          "x": 1052,
                          "y": 1072
                      },
                      {
                          "x": 1052,
                          "y": 1096
                      },
                      {
                          "x": 995,
                          "y": 1096
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 995,
                              "y": 1072
                          },
                          {
                              "x": 57,
                              "y": 1072
                          },
                          {
                              "x": 57,
                              "y": 24
                          },
                          {
                              "x": 995,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "807.50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 1118,
                          "y": 1072
                      },
                      {
                          "x": 1179,
                          "y": 1072
                      },
                      {
                          "x": 1179,
                          "y": 1096
                      },
                      {
                          "x": 1118,
                          "y": 1096
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "807.50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 1118,
                              "y": 1072
                          },
                          {
                              "x": 61,
                              "y": 1072
                          },
                          {
                              "x": 61,
                              "y": 24
                          },
                          {
                              "x": 1118,
                              "y": 24
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "CIF ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 708,
                          "y": 1121
                      },
                      {
                          "x": 740,
                          "y": 1121
                      },
                      {
                          "x": 740,
                          "y": 1143
                      },
                      {
                          "x": 708,
                          "y": 1143
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "CIF",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 708,
                              "y": 1121
                          },
                          {
                              "x": 32,
                              "y": 1121
                          },
                          {
                              "x": 32,
                              "y": 22
                          },
                          {
                              "x": 708,
                              "y": 22
                          }
                      ]
                  }
              }
          ]
      },
      {
          "block_details": {
              "block_description": "1,20,317. 50 ",
              "bounding_box": {
                  "vertices": [
                      {
                          "x": 770,
                          "y": 1121
                      },
                      {
                          "x": 867,
                          "y": 1121
                      },
                      {
                          "x": 867,
                          "y": 1143
                      },
                      {
                          "x": 770,
                          "y": 1143
                      }
                  ]
              }
          },
          "word_details": [
              {
                  "word_description": "1,20,317.",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 770,
                              "y": 1121
                          },
                          {
                              "x": 74,
                              "y": 1121
                          },
                          {
                              "x": 74,
                              "y": 24
                          },
                          {
                              "x": 770,
                              "y": 24
                          }
                      ]
                  }
              },
              {
                  "word_description": "50",
                  "bounding_box": {
                      "vertices": [
                          {
                              "x": 843,
                              "y": 1121
                          },
                          {
                              "x": 24,
                              "y": 1121
                          },
                          {
                              "x": 24,
                              "y": 22
                          },
                          {
                              "x": 843,
                              "y": 22
                          }
                      ]
                  }
              }
          ]
      }
  ]
}

export function AnnotateTool({open, onClose, api, getAnnotateImages}) {
  const annotateImages = useRef();
  let regionValues = [];
  const [thumbnails, setThumbnails] = useState([]);

  let {height:ih, width:iw} = sampleJson.metadata.image_details.file_size;
  sampleJson.text_annotations.forEach((one_block)=>{
    one_block.word_details.forEach((word)=>{
      let [tl, tr, br, bl] = word.bounding_box.vertices;
      let xs = word.bounding_box.vertices.map((v)=>v.x);
      let ys = word.bounding_box.vertices.map((v)=>v.y);

      let regionValue = {
        value: word.word_description,
      };

      // console.log(xs, ys);
      // regionValue.x = tl.x/iw;
      // regionValue.y = tl.y/ih;
      // regionValue.w = regionValue.x - tr.x/iw;
      // regionValue.h = regionValue.y - bl.y/ih;

      regionValue.xmin = Math.min(...xs);
      regionValue.ymin = Math.min(...ys);
      regionValue.xmax = Math.max(...xs);
      regionValue.ymax = Math.max(...ys);
      regionValues.push(regionValue);
    });
  });

  useEffect(()=>{
    if(open) {
        annotateImages.current = getAnnotateImages();
        let data_lists = {};
        annotateImages.current.forEach((img)=>{
          data_lists[img._id] = data_lists[img._id] || [];
          data_lists[img._id].push({
              [img.page_no]: img.img_thumb
          });
        });
        api.post(URL_MAP.GET_THUMBNAILS, data_lists)
        .then((res)=>{

        }).catch((err)=>{

        }).then(()=>{
            let data = {
                "data_lists" : {
                            "5f9c3594920d9e5fad533c1943": {"page_1": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg", "page_2": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg"},
                            "5f9c3594920d9e5fad533c1944": {"page_1": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg"},
                            "5f9c3594920d9e5fad533c1942": {"page_1": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg", "page_2": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg"},
                            "5f9c3594920d9e5fad533c1941": {"page_1": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg", "page_2": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg"},
                            "5f9c3594920d9e5fad533c1940": {"page_1": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg", "page_2": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg"},
                            "5f9c3594920d9e5fad533c1939": {"page_1": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg", "page_2": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg"},
                            "5f9c3594920d9e5fad533c1939": {"page_1": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg", "page_2": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg"},
                            "5f9c3594920d9e5fad533c1938": {"page_1": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg", "page_2": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg"},
                            "5f9c3594920d9e5fad533c1937": {"page_1": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg", "page_2": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg"},
                            "5f9c3594920d9e5fad533c1936": {"page_1": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg", "page_2": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg"},
                                }
            }

            data = data.data_lists;

            data = {
                "5f9c3594920d9e5fad533c19": {
                    "page_1": "https://artificio-datasets.s3.amazonaws.com/annotation/202010271864-sample_pdf_multiple_page-0.jpg?AWSAccessKeyId=AKIAZHJVRDUFAWRLD3GO&Signature=3uh70oaM3GbU1857vFE1IetmmMs%3D&Expires=1604348128",
                    "page_2": "https://artificio-datasets.s3.amazonaws.com/annotation/202010304426-test_image.jpg?AWSAccessKeyId=AKIAZHJVRDUFAWRLD3GO&Signature=QhZcbKesytw2iIamX7gmeUh8elo%3D&Expires=1604348128"
                },
                "5f9c3594920d9e5fad533c1944": {
                    "page_1": "https://artificio-datasets.s3.amazonaws.com/annotation/202010274182-INV_8603009_20170329135800_test-0.jpg?AWSAccessKeyId=AKIAZHJVRDUFAWRLD3GO&Signature=YixzbJNMNCc0qEaE84yLfx5Wxn4%3D&Expires=1604348128"
                }
            };
            let tmp_thumbs = [];
            for (const _id in data) {
                let tmp_thumb
                for(const page_no in data[_id]) {
                    tmp_thumbs.push({
                        _id: _id,
                        page_no: page_no,
                        src: data[_id][page_no]
                    });
                }
            }
            console.log(tmp_thumbs);
            setThumbnails(tmp_thumbs);
        });
    }
  }, [open])




//   console.log(regionValues);
  return (
    <Dialog
      fullWidth
      maxWidth='lg'
      open={open}
      onClose={onClose}
      disableBackdropClick={false}
      disableEscapeKeyDown
      PaperProps={{style: {height: '100%'}}}>

      <Annotator
        regionClsList={['label1', 'label2']}
        images={[
          {
            // "src": "https://images.unsplash.com/photo-1561518776-e76a5e48f731?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
            "src": "https://img.techpowerup.org/201029/202010236445-ka119f11o0002-9-page-0001.jpg",
            "name": "car-image-1",
            regions: [],
            region_values: regionValues,
          }
        ]}
        thumbnails={thumbnails}/>
    </Dialog>
  )
}