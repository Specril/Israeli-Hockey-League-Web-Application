import pyodbc
import json

def main():
    conn, cursor = makeConnection()
    #uncomment if neccecery:
    '''
    dropTable(tableName, cursor, conn)
    createTable(tableName, cursor, conn)
    alterTable(tableName, cursor, conn)
    '''
    jsonFile = readDataJson()
    insertDataLeague(jsonFile, cursor, conn)
    insertDataUsers(jsonFile, cursor, conn)
    insertDataUsersReferees(jsonFile, cursor, conn)
    insertDataUsersPlayers(jsonFile, cursor, conn)
    insertDataUsersPlayersInTeams(jsonFile, cursor, conn)
    insertDataTeams(jsonFile, cursor, conn)
    insertDataGoals(jsonFile, cursor, conn)
    insertDataGames(jsonFile, cursor, conn)
    insertDataTeamsInLeagues(jsonFile, cursor, conn)
    insertDataLocations(jsonFile, cursor, conn)
    cursor.close()
    conn.close()


main()

# Implementation of the inner functions:
def makeConnection():
    server = 'hockey-il-server.database.windows.net'
    database = 'Hockey League DB v2'
    username = 'IsraeliHockeyLeague'
    password = 'ZivCool69'

    # Create the connection string
    connection_string = f'DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}'

    # Connect to the database
    conn = pyodbc.connect(connection_string)
    cursor = conn.cursor()
    return conn, cursor


def dropTable(tableName, cursor, conn):
    drop_table_query = f'''DROP TABLE {tableName}'''
    cursor.execute(drop_table_query)
    conn.commit()


def createTable(tableName, cursor, conn):
    # update the relevent attributes according to the table
    create_table_query = f'''CREATE TABLE {tableName} (
    Team_ID int PRIMARY KEY,
    Photo varchar(255)
    )
    '''
    cursor.execute(create_table_query)
    conn.commit()

def alterTable(tableName, cursor, conn):
    alter_table_query = f"""
    ALTER TABLE {tableName}
    ALTER COLUMN Photo TEXT;
    """
    cursor.execute(alter_table_query)
    conn.commit()

def readDataJson():
    file_path = 'C:/Users/Naama/finalProject/output.json'
    with open(file_path, 'r', encoding='utf-8') as file:
        jsonFile = json.load(file)
    return jsonFile


def insertDataLeague(jsonFile, cursor, conn):
    dataObj = []
    for league in jsonFile['League']:
        currObj = jsonFile['League'][league]
        currTuple = tuple([currObj['Leage_ID'], currObj['League_Name'], currObj['League_Type']])
        dataObj.append(currTuple)

    insert_query = '''
    INSERT INTO League (League_ID, League_Name, League_Type) VALUES (?,?,?)
    '''
    print(dataObj)
    for row in dataObj:
        cursor.execute(insert_query, row)

    conn.commit()


def insertDataUsers(jsonFile, cursor, conn):
    dataObj = []
    for user in jsonFile['Users']:
        currObj = jsonFile['Users'][user]
        currTuple = tuple([currObj['User_ID'], currObj['Full_Name'], currObj['Date_of_Birth'], currObj['Phone'], currObj['Email']])
        dataObj.append(currTuple)

    insert_query = '''
    INSERT INTO Users (User_ID, Full_Name, Date_of_Birth, Phone, Email) VALUES (?,?,?,?,?)
    '''
    print(dataObj)
    for row in dataObj:
        cursor.execute(insert_query, row)

    conn.commit()

def insertDataUsersReferees(jsonFile, cursor, conn):
    dataObj = []
    for referee in jsonFile['Users-Referees']:
        currObj = jsonFile['Users-Referees'][referee]
        currTuple = tuple([currObj['User_ID'], currObj['Date_Created'], currObj['Experience']])
        dataObj.append(currTuple)

    insert_query = '''
    INSERT INTO UsersReferees (User_ID, Date_Created, Experience) VALUES (?,?,?)
    '''
    print(dataObj)
    for row in dataObj:
        cursor.execute(insert_query, row)

    conn.commit()

def insertDataUsersPlayers(jsonFile, cursor, conn):
    dataObj = []
    for player in jsonFile['Users-Players']:
        currObj = jsonFile['Users-Players'][player]
        currTuple = tuple([currObj['User_ID'], currObj['Date_Created'], currObj['Experience'], currObj['Residence']])
        dataObj.append(currTuple)

    insert_query = '''
    INSERT INTO UsersPlayers (User_ID, Date_Created, Experience, Residence) VALUES (?,?,?,?)
    '''
    print(dataObj)
    for row in dataObj:
        cursor.execute(insert_query, row)

    conn.commit()


def insertDataUsersPlayersInTeams(jsonFile, cursor, conn):
    dataObj = []
    for player in jsonFile['Players_In_Teams']:
        currObj = jsonFile['Players_In_Teams'][player]
        currTuple = tuple([currObj['User_ID'], currObj['Team_ID'], currObj['Position'], currObj['Shirt_Number']])
        dataObj.append(currTuple)

    insert_query = '''
    INSERT INTO PlayersInTeams (User_ID, Team_ID, Position, Shirt_Number) VALUES (?,?,?,?)
    '''
    print(dataObj)
    for row in dataObj:
        cursor.execute(insert_query, row)

    conn.commit()


def insertDataTeams(jsonFile, cursor, conn):
    dataObj = []
    for team in jsonFile['Teams']:
        currObj = jsonFile['Teams'][team]
        currTuple = tuple([currObj['Team_ID'], currObj['Team_Name'], currObj['Rank'], currObj['Location_ID'], currObj['League_ID']])
        dataObj.append(currTuple)

    insert_query = '''
    INSERT INTO Teams (Team_ID, Team_Name, Rank, Location_ID, League_ID) VALUES (?,?,?,?,?)
    '''
    print(dataObj)
    for row in dataObj:
        cursor.execute(insert_query, row)

    conn.commit()


def insertDataGoals(jsonFile, cursor, conn):
    dataObj = []
    for goal in jsonFile['Goals']:
        currObj = jsonFile['Goals'][goal]
        currTuple = tuple([currObj['Goal_ID'], currObj['Game_ID'], currObj['User_ID'], currObj['Team_ID'], currObj['Time_Stamp']])
        dataObj.append(currTuple)

    insert_query = '''
    INSERT INTO Goals (Goal_ID, Game_ID, User_ID, Team_ID, Time_Stamp) VALUES (?,?,?,?,?)
    '''
    print(dataObj)
    for row in dataObj:
        cursor.execute(insert_query, row)

    conn.commit()


def insertDataGames(jsonFile, cursor, conn):
    dataObj = []
    for game in jsonFile['Games']:
        currObj = jsonFile['Games'][game]
        currTuple = tuple([currObj['Game_ID'], currObj['League_ID'], currObj['Home_Team_ID'], currObj['Away_Team_ID'], currObj['Day'], currObj['Date'], currObj['Start_Time'],currObj['Location'], currObj['Location_ID'], currObj['Referee_ID'], currObj['Second_Referee_ID']])
        dataObj.append(currTuple)

    insert_query = '''
    INSERT INTO Games (Game_ID, League_ID, Home_Team_ID, Away_Team_ID, Day, Date, Start_Time, Location, Location_ID, Referee_ID, Second_Referee_ID) VALUES (?,?,?,?,?,?,?,?,?,?,?)
    '''
    print(dataObj)
    for row in dataObj:
        cursor.execute(insert_query, row)

    conn.commit()


def insertDataTeamsInLeagues(jsonFile, cursor, conn):
    dataObj = []
    for team in jsonFile['Teams_In_Leagues']:
        currObj = jsonFile['Teams_In_Leagues'][team]
        currTuple = tuple([currObj['Team_ID'], currObj['League_ID']])
        dataObj.append(currTuple)

    insert_query = '''
    INSERT INTO TeamsInLeagues (Team_ID, League_ID) VALUES (?,?)
    '''
    print(dataObj)
    for row in dataObj:
        cursor.execute(insert_query, row)

    conn.commit()


def insertDataLocations(jsonFile, cursor, conn):
    dataObj = []
    for location in jsonFile['Locations']:
        currObj = jsonFile['Locations'][location]
        currTuple = tuple([currObj['Location_ID'], currObj['Location_Name']])
        dataObj.append(currTuple)

    insert_query = '''
    INSERT INTO Locations (Location_ID, Location_Name) VALUES (?,?)
    '''
    print(dataObj)
    for row in dataObj:
        cursor.execute(insert_query, row)

    conn.commit()



