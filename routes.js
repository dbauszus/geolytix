module.exports = fastify => {

    // Create constructor for mobile detect module.
    const Md = require('mobile-detect');

    // Set jsrender module for server-side templates.
    const jsr = require('jsrender');

    fastify.get('/', (req, res) => getSite(req, res));

    fastify.get('/en', (req, res) =>  getSite(req, res, true));

    function getSite(req, res, translate){

        let md = new Md(req.headers['user-agent']);

        let o = (md.mobile() === null || md.tablet() !== null) ?
            {
                tmpl: jsr.templates('./views/desktop.html'),
                platform: 'desktop'
            } : {
                tmpl: jsr.templates('./views/mobile.html'),
                platform: 'mobile'
            };

        let locales = {
            uk: {
                locale: 'uk',
                office: 0,
                meta: 'Location Planning experts providing retail & demographic data worldwide. We find the right network strategy solution for our customers.',
                header: './public/tmpl/' + o.platform + '/uk_header.html',
                header_css: '<link rel="stylesheet" type="text/css" href="/css/' + o.platform + '_header_white.css"/>',
                services: './public/tmpl/' + o.platform + '/uk_services.html',
                case_studies: './public/tmpl/' + o.platform + '/uk_case_studies.html',
                team: './public/tmpl/' + o.platform + '/uk_team.html',
                geodata: './public/tmpl/' + o.platform + '/uk_geodata.html',
                photo: './public/tmpl/' + o.platform + '/uk_team_photo.html',
                footer: './public/tmpl/' + o.platform + '/uk_footer.html'
            },
            cn: {
                locale: 'cn',
                office: 2,
                meta: '为英国，欧洲及美洲的零售商及投资者提供门店选址，人口统计资料分析，客户及市场洞察的数据及专业服务。',
                header: './public/tmpl/' + o.platform + '/cn_header.html',
                header_css: '<link rel="stylesheet" type="text/css" href="/css/' + o.platform + '_header_black.css"/>',
                services: './public/tmpl/' + o.platform + '/cn_services.html',
                team: './public/tmpl/' + o.platform + '/cn_team.html',
                geodata: './public/tmpl/' + o.platform + '/cn_geodata.html',
                photo: './public/tmpl/' + o.platform + '/no_team_photo.html',
                footer: './public/tmpl/' + o.platform + '/cn_footer.html'
            },
            cn_en: {
                locale: 'cn_en',
                office: 2,
                meta: 'Location Planning experts providing retail & demographic data worldwide. We find the right network strategy solution for our customers.',
                header: './public/tmpl/' + o.platform + '/cn_en_header.html',
                header_css: '<link rel="stylesheet" type="text/css" href="/css/' + o.platform + '_header_black.css"/>',
                services: './public/tmpl/' + o.platform + '/uk_services.html',
                team: './public/tmpl/' + o.platform + '/cn_en_team.html',
                geodata: './public/tmpl/' + o.platform + '/cn_en_geodata.html',
                photo: './public/tmpl/' + o.platform + '/no_team_photo.html',
                footer: './public/tmpl/' + o.platform + '/cn_footer.html'
            },
            jp: {
                locale: 'jp',
                office: 3,
                meta: 'Location Planning experts providing retail & demographic data worldwide. We find the right network strategy solution for our customers.',
                header: './public/tmpl/' + o.platform + '/jp_header.html',
                header_css: '<link rel="stylesheet" type="text/css" href="/css/' + o.platform + '_header_black.css"/>',
                services: './public/tmpl/' + o.platform + '/jp_services.html',
                team: './public/tmpl/' + o.platform + '/jp_team.html',
                geodata: './public/tmpl/' + o.platform + '/jp_geodata.html',
                photo: './public/tmpl/' + o.platform + '/no_team_photo.html',
                footer: './public/tmpl/' + o.platform + '/uk_footer.html'
            },
            jp_en: {
                locale: 'jp',
                office: 3,
                meta: '「ロケーション計画の専門家が、世界中の小売りおよび人口統計データを提供します。私達は、顧客の為に適したネットワーク戦略の解決策を見つけ出します。」',
                header: './public/tmpl/' + o.platform + '/jp_en_header.html',
                header_css: '<link rel="stylesheet" type="text/css" href="/css/' + o.platform + '_header_black.css"/>',
                services: './public/tmpl/' + o.platform + '/uk_services.html',
                team: './public/tmpl/' + o.platform + '/jp_team.html',
                geodata: './public/tmpl/' + o.platform + '/jp_geodata.html',
                photo: './public/tmpl/' + o.platform + '/no_team_photo.html',
                footer: './public/tmpl/' + o.platform + '/uk_footer.html'
            },
            de: {
                locale: 'de',
                office: 4,
                meta: 'Experten für Standortplanung, die Daten aus dem Einzelhandel und demografische Daten weltweit bereitstellen. Wir finden die richtige Netzwerkstrategie für unsere Kunden.',
                header: './public/tmpl/' + o.platform + '/de_header.html',
                header_css: '<link rel="stylesheet" type="text/css" href="/css/' + o.platform + '_header_black.css"/>',
                services: './public/tmpl/' + o.platform + '/de_services.html',
                case_studies: './public/tmpl/' + o.platform + '/de_case_studies.html',
                team: './public/tmpl/' + o.platform + '/de_team.html',
                geodata: './public/tmpl/' + o.platform + '/de_geodata.html',
                photo: './public/tmpl/' + o.platform + '/uk_team_photo.html',
                footer: './public/tmpl/' + o.platform + '/uk_footer.html'
            }
        };

        

        if (req.headers['x-forwarded-host'] && req.headers['x-forwarded-host'].includes('.de'))
            return res.type('text/html').send(o.tmpl.render(locales.de));

        if (req.headers['x-forwarded-host'] && req.headers['x-forwarded-host'].includes('.cn') && translate)
            return res.type('text/html').send(o.tmpl.render(locales.cn_en));
        
        if (req.headers['x-forwarded-host'] && req.headers['x-forwarded-host'].includes('.cn'))
            return res.type('text/html').send(o.tmpl.render(locales.cn));

        if (req.headers['x-forwarded-host'] && req.headers['x-forwarded-host'].includes('.jp') && translate)
            return res.type('text/html').send(o.tmpl.render(locales.cn_en));
        
        if (req.headers['x-forwarded-host'] && req.headers['x-forwarded-host'].includes('.jp'))
            return res.type('text/html').send(o.tmpl.render(locales.jp));

        res.type('text/html').send(o.tmpl.render(locales.uk));
    }

    fastify.register(require('fastify-postgres'), {
        connectionString: process.env.POSTGRES_GEOSERVER,
        name: 'gs'
    });

    fastify.register(require('fastify-postgres'), {
        connectionString: process.env.POSTGRES_GHS,
        name: 'ghs'
    });
    
    fastify.get('/map', (req, res) => {
        let md = new Md(req.headers['user-agent']),
            dataset = req.raw.originalUrl.substring(req.raw.originalUrl.indexOf('?') + 1),
            tmpl = (md.mobile() === null || md.tablet() !== null) ?
                jsr.templates('./views/gd_map_d.html') :
                jsr.templates('./views/gd_map_m.html');

        res.type('text/html').send(tmpl.render({ gd_tmpl: './public/tmpl/gd_' + dataset + '.html' }));
    });

    fastify.get('/grid_query', async (req, res) => {
        let q = `
        SELECT
            lon,
            lat,
            ${req.query.c} c,
            ${req.query.v} v
        FROM ${req.query.layer}
        WHERE
            ST_Intersects(
                ST_MakeEnvelope(
                    ${req.query.west},
                    ${req.query.south},
                    ${req.query.east},
                    ${req.query.north},
                    4326
                ), ${req.query.geom}
            )
        LIMIT 10000;`;

        var db_connection = await fastify.pg[req.query.database].connect();
        var result = await db_connection.query(q);
        db_connection.release();

        if (result.rows.length === 0) return res.code(204).send();

        res.code(200).send(result.rows);
    });
}