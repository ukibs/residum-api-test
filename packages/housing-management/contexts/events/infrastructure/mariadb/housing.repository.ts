import { Connection } from "mariadb";
import { ServiceConnector } from "../../../../../shared/contexts/domain/contracts/service-connector";
import { DatabaseError, Maybe } from "../../../../../shared/contexts/domain/errors";
import { Clock } from "../../../../../shared/contexts/domain/services/clock.service";
import {
    addOrder,
    checkAndPutWhereKeywordInQuery,
    getValuesAndKeysAsArray,
    getValuesForInsertQuery,
    getValuesForUpdateQuery,
    singularDatabaseOperation,
    singularQuery,
} from "../../../../../shared/utils/database-utils";
import { HousingRepository } from "../../domain/contracts/housing.repository";
import { Owner } from "../../domain/models/owner.entity";
import { Housing } from "../../domain/models/housing.entity";
import { Event } from "../../domain/models/event.entity";
import { AuthorizedUserProperties } from "../../../../../shared/contexts/domain/models/authorized-user.entity";
import { validate } from "uuid";
import { UUID } from "../../../../../shared/contexts/domain/value-objects";
import { HOUSING_CATEGORY } from "../../../../../shared/utils/constansts";
import { isNil } from "../../../../../shared/utils/type-checkers";

export function housingRepositoryBuilder({
    databaseConnector,
}: {
    databaseConnector: ServiceConnector<Connection>;
}): HousingRepository {
    async function insertEventWithTicketsAndExtras(conn: Connection, event: Event) {

        const { event_categories, tickets, extras, ...eventValue } = event.value;
        console.debug("Event value: ", eventValue);
        const { objectValuesArray, objectKeysArray } = getValuesAndKeysAsArray(eventValue);
        const insertValues = getValuesForInsertQuery(objectValuesArray, objectKeysArray, []);
        const query = `INSERT into events (${insertValues.keys}) values (${insertValues.interrogations})`;
        await conn.query(query, insertValues.values);

        // Category entry
        if (event_categories) {
            for (let i = 0; i < event_categories.length; i++) {
                const { objectValuesArray, objectKeysArray } = getValuesAndKeysAsArray(
                    event_categories[i]
                );
                const insertValues = getValuesForInsertQuery(
                    objectValuesArray,
                    objectKeysArray,
                    []
                );
                const query = `INSERT into event_categories (${insertValues.keys}) VALUES (${insertValues.interrogations})`;
                await conn.query(query, insertValues.values);
            }
        }

        // Tickets
        if (tickets) {
            for (let i = 0; i < tickets.length; i++) {
                console.debug("Ticket value: ", tickets[i]);
                const { objectValuesArray, objectKeysArray } = getValuesAndKeysAsArray(tickets[i]);
                const insertValues = getValuesForInsertQuery(
                    objectValuesArray,
                    objectKeysArray,
                    []
                );
                const query = `INSERT into tickets (${insertValues.keys}) values (${insertValues.interrogations})`;
                await conn.query(query, insertValues.values);
            }
        }

        // Extras
        if (extras) {
            for (let i = 0; i < extras.length; i++) {
                console.debug("Extra value: ", extras[i]);
                const { objectValuesArray, objectKeysArray } = getValuesAndKeysAsArray(extras[i]);
                const insertValues = getValuesForInsertQuery(
                    objectValuesArray,
                    objectKeysArray,
                    []
                );
                const query = `INSERT into extras (${insertValues.keys}) values (${insertValues.interrogations})`;
                await conn.query(query, insertValues.values);
            }
        }
    }

    return {
        async create(
            owner: Owner,
            housing: Housing,
            parentEvent: Event,
            childEvents: Event[]
        ): Promise<Maybe<Housing>> {

            return [null, null];

            // Realizamos la operación
            const conn = await databaseConnector.getConnection();

            try {
                // 0. Start transaction.
                await conn.beginTransaction();

                // 1. Create new owner.
                if (owner) {
                    const ownerValue = owner.value;
                    console.debug("Housing value: ", ownerValue);
                    const { objectValuesArray, objectKeysArray } =
                        getValuesAndKeysAsArray(ownerValue);
                    const insertValues = getValuesForInsertQuery(
                        objectValuesArray,
                        objectKeysArray,
                        []
                    );
                    const query = `INSERT into housing_owners (${insertValues.keys}) values (${insertValues.interrogations})`;
                    await conn.query(query, insertValues.values);
                }

                // 2. Create new housing.
                if (true) {
                    const housingValue = housing.value;
                    console.debug("Housing value: ", housingValue);
                    const { objectValuesArray, objectKeysArray } =
                        getValuesAndKeysAsArray(housingValue);
                    const insertValues = getValuesForInsertQuery(
                        objectValuesArray,
                        objectKeysArray,
                        []
                    );
                    const query = `INSERT into housing (${insertValues.keys}) values (${insertValues.interrogations})`;
                    await conn.query(query, insertValues.values);
                }

                // 3. Create new parent event
                if (true) {
                    await insertEventWithTicketsAndExtras(conn, parentEvent);
                }

                // 4. Child events
                if (childEvents) {
                    for (let i = 0; i < childEvents.length; i++) {
                        await insertEventWithTicketsAndExtras(conn, childEvents[i]);
                    }
                }

                // 9. Commit transaction.
                await conn.commit();
                console.debug("Transaction commited");

                return [housing, null];
            } catch (e) {
                // Roll back transaction.
                await conn.rollback();
                console.debug(e);
                if (conn) conn.destroy();
                return [
                    null,
                    new DatabaseError("There was a problem with the housing creation transaction"),
                ];
            } finally {
                // Terminate connection gracefully.
                if (conn) await conn.end();
            }
        },
        async getAll(parameters: any, executedBy: AuthorizedUserProperties): Promise<Maybe<any>> {
            console.debug("Testing get all 8");
            return [null, null];

            const { search, is_reserved, property_type, sede, page, perPage, asc, desc } =
                parameters;
            console.debug("Parameters: ", parameters);

            //
            let parametersQuery = "";
            if (search) {
                parametersQuery += ` AND (address LIKE '%${search}%' OR property_type LIKE '%${search}%')`;
            }
            if (!isNil(is_reserved)) {
                if (is_reserved) {
                    parametersQuery += `
                        AND EXISTS (
                            SELECT 1
                            FROM events e
                            JOIN tickets t ON t.event_id = e.id
                            JOIN order_tickets ot ON ot.ticket_id = t.id
                            WHERE e.housing_id = h.id
                        )
                    `;
                } else {
                    parametersQuery += ` 
                        AND NOT EXISTS (
                            SELECT 1
                            FROM events e
                            JOIN tickets t ON t.event_id = e.id
                            JOIN order_tickets ot ON ot.ticket_id = t.id
                            WHERE e.housing_id = h.id
                        )
                    `;
                }
            }
            if (property_type) {
                parametersQuery += ` AND property_type = '${property_type}'`;
            }
            if (sede) {
                parametersQuery += ` AND sede = '${sede}'`;
            }

            // Order
            let orderQuery = "";
            if (asc) orderQuery += addOrder(orderQuery, "ASC", asc);
            if (desc) orderQuery += addOrder(orderQuery, "DESC", desc);

            // Pagination
            const paginationQuery =
                perPage && page ? ` LIMIT ${perPage} OFFSET ${perPage * (page - 1)}` : "";

            const mainQuery = `
                SELECT 
                    h.*,
                    EXISTS (
                        SELECT 1
                        FROM events e
                        JOIN tickets t ON t.event_id = e.id
                        JOIN order_tickets ot ON ot.ticket_id = t.id
                        WHERE e.housing_id = h.id
                    ) AS is_reserved
                FROM housing h
                WHERE 1 = 1
                ${parametersQuery}
                ${orderQuery}
                ${paginationQuery}
            `;
            console.debug("Main query: ", mainQuery);

            const [mainResult, mError] = await singularDatabaseOperation(
                databaseConnector,
                mainQuery,
                null,
                "There was an error selecting the housing"
            );
            if (mError) return [null, mError];

            const countQuery = `
                SELECT COUNT(h.id) AS count
                FROM housing h
                WHERE 1 = 1
                ${parametersQuery}
            `;

            const [countResult, cError] = await singularDatabaseOperation(
                databaseConnector,
                countQuery,
                null,
                "There was an error selecting the housing"
            );
            if (cError) return [null, cError];

            //
            for (let i = 0; i < mainResult.length; i++) {
                // TODO: Pedidos pagados
                const numbersQuery = `
                    SELECT 
                        SUM (o.amount) AS totalAmount, SUM (o.commission) AS totalCommission
                    FROM housing h
                    JOIN events e ON e.housing_id = h.id
                    JOIN orders o ON o.event_id = e.id
                    WHERE h.id = ?
                `;

                const [numbersResult, nError] = await singularDatabaseOperation(
                    databaseConnector,
                    numbersQuery,
                    [mainResult[i].id],
                    "There was an error selecting the housing"
                );
                if (nError) return [null, nError];
                mainResult[i].sales = numbersResult[0];
            }

            const result =
                page && perPage
                    ? {
                        page: page,
                        perpage: perPage,
                        total: parseInt(countResult[0].count),
                        data: mainResult,
                    }
                    : mainResult;

            return [result, null];
        },
        async getById(id: string): Promise<Maybe<any>> {

            return [null, null];

            // TODO: Coger todo lo realitvo al housing
            // Housing
            const [housingResult, hError] = await singularDatabaseOperation(
                databaseConnector,
                "SELECT * FROM housing WHERE id = ?",
                [id],
                "There was an error selecting the housing"
            );
            if (hError) return [null, hError];
            if (housingResult.length === 0) return [null, new DatabaseError("Housing not found")];

            // Owner
            const [ownerResult, oError] = await singularDatabaseOperation(
                databaseConnector,
                "SELECT * FROM housing_owners WHERE id = ?",
                [housingResult[0].owner_id],
                "There was an error selecting the housing"
            );
            if (oError) return [null, oError];

            // Events
            const [eventsResult, eError] = await singularDatabaseOperation(
                databaseConnector,
                `
                    SELECT 
                        e.*,
                        EXISTS (
                            SELECT 1
                            FROM tickets t
                            JOIN order_tickets ot ON ot.ticket_id = t.id
                            WHERE t.event_id = e.id
                        ) AS is_reserved 
                    FROM events e 
                    WHERE e.housing_id = ?
                `,
                [id],
                "There was an error selecting the housing"
            );
            if (eError) return [null, eError];

            // Events tickets and extras
            for (let i = 0; i < eventsResult.length; i++) {
                // Event categories
                const [eventCategoriesResult, ecError] = await singularDatabaseOperation(
                    databaseConnector,
                    `SELECT * FROM event_categories WHERE event_id = ?`,
                    [eventsResult[i].id],
                    "There was a problem with the events selection"
                );
                if (ecError) return [null, ecError];
                eventsResult[i].event_categories = eventCategoriesResult;

                // Tickets
                const [ticketsResult, tError] = await singularDatabaseOperation(
                    databaseConnector,
                    "SELECT * FROM tickets WHERE event_id = ?",
                    [eventsResult[i].id],
                    "There was an error selecting the housing"
                );
                if (tError) return [null, tError];
                eventsResult[i].tickets = ticketsResult;

                // Extras
                const [extrasResult, eError] = await singularDatabaseOperation(
                    databaseConnector,
                    "SELECT * FROM extras WHERE event_id = ?",
                    [eventsResult[i].id],
                    "There was an error selecting the housing"
                );
                if (eError) return [null, eError];
                eventsResult[i].extras = extrasResult;
            }

            const result = {
                owner: ownerResult,
                housing: housingResult,
                events: eventsResult,
            };

            return [result, null];
        },
        async update(id: string, housing: Housing): Promise<Maybe<any>> {

            return [null, null];

            // Realizamos la operación
            const conn = await databaseConnector.getConnection();

            try {
                // 1. Start transaction.
                await conn.beginTransaction();

                // 2. Create new housing.
                if (true) {
                    const housingValue = housing.value;
                    console.debug("Housing value: ", housingValue);
                    const { objectValuesArray, objectKeysArray } =
                        getValuesAndKeysAsArray(housingValue);
                    const updateValues = getValuesForUpdateQuery(
                        objectValuesArray,
                        objectKeysArray,
                        []
                    );
                    const query = `UPDATE housing SET ${updateValues.keys} WHERE id = ?`;
                    await conn.query(query, [...updateValues.values, id]);
                }

                // 3. Create new event
                // if (true) {
                //     const eventValue = event.value;
                //     console.debug("Event value: ", eventValue);
                //     const { objectValuesArray, objectKeysArray } =
                //         getValuesAndKeysAsArray(eventValue);
                //     const insertValues = getValuesForInsertQuery(
                //         objectValuesArray,
                //         objectKeysArray,
                //         []
                //     );
                //     const query = `INSERT into events (${insertValues.keys}) values (${insertValues.interrogations})`;
                //     await conn.query(query, insertValues.values);
                // }

                // 9. Commit transaction.
                await conn.commit();
                console.debug("Transaction commited");

                return [housing, null];
            } catch (e) {
                // Roll back transaction.
                await conn.rollback();
                console.debug(e);
                if (conn) conn.destroy();
                return [
                    null,
                    new DatabaseError("There was a problem with the housing update transaction"),
                ];
            } finally {
                // Terminate connection gracefully.
                if (conn) await conn.end();
            }
        },
        async delete(id: string): Promise<Maybe<any>> {

            return [null, null];

            const conn = await databaseConnector.getConnection();

            try {
                // 1. Start transaction.
                await conn.beginTransaction();

                // 2. Delete housing.
                const housingResult = await conn.query("DELETE FROM housing WHERE id = ?", [id]);
                console.debug("Housing deletion result: ", housingResult);

                const eventsGetResult = await conn.query("SELECT * FROM events WHERE id = ?", [id]);
                console.debug("Events selection result: ", eventsGetResult);
                const eventsIds = eventsGetResult.map((entry: { id: any }) => entry.id);
                const eventsIdsQuery = eventsIds.join("','");

                const eventsDeletionResult = await conn.query(
                    "DELETE FROM events WHERE housing_id = ?",
                    [id]
                );
                console.debug("Events deletion result: ", eventsDeletionResult);

                const ticketsDeletionResult = await conn.query(
                    `DELETE FROM tickets WHERE event_id IN ('${eventsIdsQuery}')`,
                    [id]
                );
                console.debug("Tickets deletion result: ", eventsDeletionResult);

                const extrasDeletionResult = await conn.query(
                    `DELETE FROM extras WHERE event_id IN ('${eventsIdsQuery}')`,
                    [id]
                );
                console.debug("Extras deletion result: ", extrasDeletionResult);

                // 9. Commit transaction.
                await conn.commit();
                console.debug("Transaction commited");

                // return [housing, null];
            } catch (e) {
                // Roll back transaction.
                await conn.rollback();
                console.debug(e);
                if (conn) conn.destroy();
                return [
                    null,
                    new DatabaseError("There was a problem with the housing update transaction"),
                ];
            } finally {
                // Terminate connection gracefully.
                if (conn) await conn.end();
            }

            return ["success", null];
        },
        // Owners
        async getAllOwners(
            parameters: any,
            executedBy: AuthorizedUserProperties
        ): Promise<Maybe<any>> {

            return [null, null];

            const { search, sede, page, perPage } = parameters;
            console.debug("Parameters: ", parameters);

            //
            let parametersQuery = "";
            if (search) {
                parametersQuery += ` AND name LIKE '%${search}%'`;
            }
            if (sede) {
                parametersQuery += ` AND sede = '${sede}'`;
            }

            // Pagination
            const paginationQuery =
                perPage && page ? ` LIMIT ${perPage} OFFSET ${perPage * (page - 1)}` : "";

            const mainQuery = `
                SELECT 
                    *
                FROM housing_owners
                WHERE 1 = 1
                ${parametersQuery}
                ${paginationQuery}
            `;
            console.debug("Main query: ", mainQuery);

            const [mainResult, mError] = await singularDatabaseOperation(
                databaseConnector,
                mainQuery,
                null,
                "There was an error selecting the housing"
            );
            if (mError) return [null, mError];

            const countQuery = `
                SELECT COUNT(id) AS count
                FROM housing_owners
                WHERE 1 = 1
                ${parametersQuery}
            `;

            const [countResult, cError] = await singularDatabaseOperation(
                databaseConnector,
                countQuery,
                null,
                "There was an error selecting the housing"
            );
            if (cError) return [null, cError];

            const result =
                page && perPage
                    ? {
                        page: page,
                        perpage: perPage,
                        total: parseInt(countResult[0].count),
                        data: mainResult,
                    }
                    : mainResult;

            return [result, null];
        },
        async getOwnerById(id: string): Promise<Maybe<any>> {

            return [null, null];

            const mainQuery = `
                SELECT 
                    *
                FROM housing_owners
                WHERE id = ?
            `;

            const [mainResult, mError] = await singularDatabaseOperation(
                databaseConnector,
                mainQuery,
                [id],
                "There was an error selecting the housing"
            );
            if (mError) return [null, mError];

            const owner = mainResult[0];

            const housingQuery = `
                SELECT 
                    *
                FROM housing
                WHERE owner_id = ?
            `;

            const [housingResult, hError] = await singularDatabaseOperation(
                databaseConnector,
                housingQuery,
                [owner.id],
                "There was an error selecting the housing"
            );
            if (hError) return [null, hError];
            owner.housing = housingResult;

            return [owner, null];
        },
        async updateOwner(id: string, owner: Owner): Promise<Maybe<any>> {

            return [null, null];

            // Realizamos la operación
            const conn = await databaseConnector.getConnection();

            try {
                // 1. Start transaction.
                await conn.beginTransaction();

                // 2. Create new housing.
                if (true) {
                    const housingValue = owner.value;
                    console.debug("Owner value: ", housingValue);
                    const { objectValuesArray, objectKeysArray } =
                        getValuesAndKeysAsArray(housingValue);
                    const updateValues = getValuesForUpdateQuery(
                        objectValuesArray,
                        objectKeysArray,
                        []
                    );
                    const query = `UPDATE housing_owners SET ${updateValues.keys} WHERE id = ?`;
                    await conn.query(query, [...updateValues.values, id]);
                }

                // 9. Commit transaction.
                await conn.commit();
                console.debug("Transaction commited");

                return [owner, null];
            } catch (e) {
                // Roll back transaction.
                await conn.rollback();
                console.debug(e);
                if (conn) conn.destroy();
                return [
                    null,
                    new DatabaseError("There was a problem with the housing update transaction"),
                ];
            } finally {
                // Terminate connection gracefully.
                if (conn) await conn.end();
            }
        },
        // Events
        async getDomainEvents(parameters: any): Promise<Maybe<any[]>> {

            return [null, null];

            const {
                domain,
                search,
                category_id,
                subcategory_id,
                is_reserved,
                asc,
                desc,
                page,
                perPage,
            } = parameters;
            console.debug("Parameters: ", parameters);
            const conn = await databaseConnector.getConnection();

            // 1. Get the domain
            const [domainResult, dError] = await singularQuery(
                conn,
                `SELECT * FROM domains WHERE name = ?`,
                [domain],
                "There was a problem with the domain selection"
            );
            if (dError) return [null, dError];
            if (domainResult.length === 0) return [null, new DatabaseError("No domains found")];

            // 2. Get domain categories
            const [domainCategoriesResult, dcError] = await singularQuery(
                conn,
                `SELECT id FROM categories WHERE domain_id = ?`,
                [domainResult[0].id],
                "There was an error with the categories selection"
            );
            if (dcError) return [null, dcError];

            console.debug("Domain categories: ", domainCategoriesResult);
            const domainCategoriesIds = domainCategoriesResult.map(
                (domainCategory: { id: any }) => domainCategory.id
            );
            console.debug("Domain categories ids: ", domainCategoriesIds);
            const interrogations = "?".repeat(domainCategoriesIds.length).split("").join(",");

            // Build category condition
            let categoryCondition = `
                WHERE
                    (
                        (ec.category_id IN (${interrogations}))
                        OR
                        ec.subcategory_id IN (
                            SELECT id
                            FROM subcategories
                            WHERE category_id IN (${interrogations})
                        )
                    )
                `;

            if (category_id) {
                const isId = validate(category_id);
                if (isId) {
                    categoryCondition = `
            WHERE
                (
                    ec.category_id IN (SELECT cs.id FROM categories cs WHERE cs.id = '${category_id}' AND cs.is_visible = true)
                    OR
                    ec.subcategory_id IN (SELECT scs.id FROM subcategories scs WHERE scs.category_id = '${category_id}' AND scs.is_visible = true)
                )
            `;
                } else {
                    categoryCondition += `
            AND (
                ec.category_id IN (SELECT cs.id FROM categories cs WHERE cs.slug = '${category_id}' AND cs.is_visible = true)
                OR
                ec.category_id IN (SELECT clis.category_id FROM category_language_infos clis WHERE clis.slug = '${category_id}' AND c.is_visible = true)
            )`;
                }
            }
            if (subcategory_id) {
                const isId = validate(subcategory_id);
                if (isId) {
                    categoryCondition = ` WHERE ec.subcategory_id IN (SELECT scs.id FROM subcategories scs WHERE scs.id = '${subcategory_id}' AND scs.is_visible = true)`;
                } else {
                    categoryCondition += `
            AND (
                ec.subcategory_id IN (SELECT scs.id FROM subcategories scs WHERE scs.slug = '${subcategory_id}' AND scs.is_visible = true)
                OR
                ec.subcategory_id IN (SELECT slis.subcategory_id FROM subcategory_language_infos slis WHERE slis.slug = '${subcategory_id}' AND sc.is_visible = true)
            )`;
                }
            }

            let parametersQuery = "";
            if (search) {
                parametersQuery += ` AND e.name LIKE LOWER('%${search.toLocaleLowerCase()}%')`;
            }
            if (!isNil(is_reserved)) {
                if (is_reserved) {
                    parametersQuery += `
                AND EXISTS (
                    SELECT 1
                    FROM events e
                    JOIN tickets t ON t.event_id = e.id
                    JOIN order_tickets ot ON ot.ticket_id = t.id
                    WHERE e.housing_id = h.id
                )
            `;
                } else {
                    parametersQuery += ` 
                AND NOT EXISTS (
                    SELECT 1
                    FROM events e
                    JOIN tickets t ON t.event_id = e.id
                    JOIN order_tickets ot ON ot.ticket_id = t.id
                    WHERE e.housing_id = h.id
                )
            `;
                }
            }

            const paginationQuery =
                perPage && page ? ` LIMIT ${perPage} OFFSET ${perPage * (page - 1)}` : "";

            const nowString = Clock.getDateTime(Clock.now());

            // 3. OPTIMIZED: Get events with all related data in a single query
            const query = `
                SELECT
                    DISTINCT e.id,
                    e.name,
                    e.short_description,
                    e.principal_url,
                    (CASE WHEN e.multi_date THEN (
                        SELECT MIN(t.start_date)
                        FROM tickets t
                        WHERE t.event_id = e.id
                        AND t.start_date >= '${nowString}'
                    ) ELSE e.start_date END) AS start_date,
                    e.end_date,
                    e.event_type,
                    e.event_tag,
                    e.min_age,
                    e.rating,
                    e.countries,
                    e.cities,
                    e.latitude,
                    e.longitude,
                    e.seo_name,
                    e.multi_date,
                    e.passport_required,
                    e.is_b2b,
                    e.housing_id,
                    h.quality_seal,
                    h.main_image_url,
                    h.images_urls,
                    h.price_monthly,
                    h.property_type,
                    EXISTS (
                        SELECT 1
                        FROM tickets t
                        JOIN order_tickets ot ON ot.ticket_id = t.id
                        WHERE t.event_id = e.id
                    ) AS is_reserved
                FROM events e
                LEFT JOIN housing h ON e.housing_id = h.id
                LEFT JOIN event_categories ec ON ec.event_id = e.id
                LEFT JOIN categories c ON c.id = ec.category_id
                LEFT JOIN subcategories sc ON sc.category_id = c.id
                ${categoryCondition}
                ${parametersQuery}
                AND e.housing_id IS NOT NULL
                AND e.is_visible = true
                AND e.is_active = true                
                ORDER BY start_date
                ${paginationQuery}
            `;

            console.debug("Query: ", query);
            const [eventsResult, eError] = await singularQuery(
                conn,
                query,
                [...domainCategoriesIds, ...domainCategoriesIds],
                "There was a problem with the events selection"
            );
            if (eError) return [null, eError];

            // 4. Get events count
            const [eventsCountResult, ecError] = await singularQuery(
                conn,
                `
                    SELECT
                        COUNT(DISTINCT e.id) AS count
                    FROM events e
                    LEFT JOIN housing h ON e.housing_id = h.id
                    LEFT JOIN event_categories ec ON ec.event_id = e.id
                    LEFT JOIN categories c ON c.id = ec.category_id
                    LEFT JOIN subcategories sc ON sc.category_id = c.id
                    ${categoryCondition}
                    ${parametersQuery}
                    AND e.housing_id IS NOT NULL
                    AND e.is_visible = true
                    AND e.is_active = true                    
                `,
                [...domainCategoriesIds, ...domainCategoriesIds],
                "There was a problem with the events selection"
            );
            if (ecError) return [null, ecError];

            // 5. OPTIMIZED: Get all related data in batches instead of N+1 queries
            if (eventsResult.length > 0) {
                const eventIds = eventsResult.map((event) => event.id);
                const eventIdsPlaceholders = eventIds.map(() => "?").join(",");

                // Get all event categories in one query
                const [allEventCategoriesResult, aecError] = await singularQuery(
                    conn,
                    `SELECT * FROM event_categories WHERE event_id IN (${eventIdsPlaceholders})`,
                    eventIds,
                    "There was a problem with the event categories selection"
                );
                if (aecError) return [null, aecError];

                // Get all event language infos in one query
                const [allEventLanguageInfosResult, aeliError] = await singularQuery(
                    conn,
                    `SELECT * FROM event_language_infos WHERE event_id IN (${eventIdsPlaceholders})`,
                    eventIds,
                    "There was a problem with the event language infos selection"
                );
                if (aeliError) return [null, aeliError];

                // Get all ticket prices in one query
                const [allEventTicketPricesResult, aetpError] = await singularQuery(
                    conn,
                    `
                SELECT
                    t.event_id, t.price, t.start_date, t.international_discount, t.early_payment_discount, t.early_payment_discount_date
                FROM tickets t
                WHERE t.event_id IN (${eventIdsPlaceholders})
                AND (
                    NOT EXISTS (SELECT 1 FROM tickets_domains td WHERE td.ticket_id = t.id) OR
                    EXISTS (SELECT 1 FROM tickets_domains td WHERE td.ticket_id = t.id AND td.domain_name = ?)
                )
            `,
                    [...eventIds, domain],
                    "There was a problem with the ticket prices selection"
                );
                if (aetpError) return [null, aetpError];

                // Get all extra prices in one query
                const [allEventExtraPricesResult, aeepError] = await singularQuery(
                    conn,
                    `
                SELECT
                    e.event_id, e.id, e.name, e.price 
                FROM extras e
                WHERE e.event_id IN (${eventIdsPlaceholders})                        
            `,
                    eventIds,
                    "There was a problem with the extra prices selection"
                );
                if (aeepError) return [null, aeepError];

                // 6. OPTIMIZED: Group related data by event_id for O(1) lookup
                const eventCategoriesMap = new Map();
                const eventLanguageInfosMap = new Map();
                const eventTicketPricesMap = new Map();
                const eventExtraPricesMap = new Map();

                // Group event categories
                allEventCategoriesResult.forEach((category) => {
                    if (!eventCategoriesMap.has(category.event_id)) {
                        eventCategoriesMap.set(category.event_id, []);
                    }
                    eventCategoriesMap.get(category.event_id).push(category);
                });

                // Group event language infos
                allEventLanguageInfosResult.forEach((langInfo) => {
                    if (!eventLanguageInfosMap.has(langInfo.event_id)) {
                        eventLanguageInfosMap.set(langInfo.event_id, []);
                    }
                    eventLanguageInfosMap.get(langInfo.event_id).push(langInfo);
                });

                // Group ticket prices
                allEventTicketPricesResult.forEach((ticket) => {
                    if (!eventTicketPricesMap.has(ticket.event_id)) {
                        eventTicketPricesMap.set(ticket.event_id, []);
                    }
                    eventTicketPricesMap.get(ticket.event_id).push(ticket);
                });

                // Group extra prices
                allEventExtraPricesResult.forEach((extra) => {
                    if (!eventExtraPricesMap.has(extra.event_id)) {
                        eventExtraPricesMap.set(extra.event_id, []);
                    }
                    eventExtraPricesMap.get(extra.event_id).push(extra);
                });

                // 7. Assign related data to each event (same structure as original)
                for (let i = 0; i < eventsResult.length; i++) {
                    const eventId = eventsResult[i].id;

                    eventsResult[i].event_categories = eventCategoriesMap.get(eventId) || [];
                    eventsResult[i].event_language_infos = eventLanguageInfosMap.get(eventId) || [];
                    eventsResult[i].event_ticket_prices = eventTicketPricesMap.get(eventId) || [];
                    eventsResult[i].event_extra_prices = eventExtraPricesMap.get(eventId) || [];
                }
            }

            // Destroy connection and return result
            await conn.end();

            const result =
                page && perPage
                    ? {
                        page: page,
                        perpage: perPage,
                        total: parseInt(eventsCountResult[0].count),
                        data: eventsResult,
                    }
                    : eventsResult;

            return [result, null];
        },
    };
}
