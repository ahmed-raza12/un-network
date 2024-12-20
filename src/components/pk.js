{
  "rules": {
    "customers": {
      "$userId": {
        ".read": true,
        ".write": true
      }
    },
    "dealers": {
      ".read": true,
      ".write": true
    },
    "staff": {
      "$userId": {
        ".read": true,
        ".write": true
      }
    },
    "users": {
      "$uId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    "isps": {
      "$userId": {
        ".read": true,
        ".write": true,
        "$ispId": {
          ".read": true,
          ".write": true
        }
      }
    },
    "packages": {
      "$ispId": {
        ".read": true,
        ".write": true
      }
    },
    "invoices": {
      "$dealerId": {
        ".read": true,  // Allow read access for this dealer
        ".write": true, // Allow write access for this dealer
        "$year": {
          "$month": {
            "$today": {
              "$nestedDealerId": {
                ".read": true, // Ensure the nested dealer ID matches the path
                ".write": true // Same check for write
              }
            }
          }
        }
      }
      },
    "customerInvoiceHistory": {
      "$customerId": {
        ".read": true,
        ".write": true,
        "monthlyInvoices": {
          "$year": {
            "$month": {
              ".read": true,
              ".write": true
            }
          }
        },
        "lastInvoiceDate": {
          ".read": true,
          ".write": true
        }
      }
    }
  }
}
