This file is for you to describe the urbanmap application. Typically
you would include information such as the information below:

Installation and Setup
======================

Without Buildout

1)You need to have mapfish 2.2 installed and the mapfish print module: 

http://www.mapfish.org/doc/2.2/installation.html

http://www.mapfish.org/doc/print/installation.html

2)Download the last urbanmap tag on the SVN (trunk is unstable)

3)Setup virtual env (should be done with mapfish installation)

With Buildout

1) git clone https://github.com/Geode/urbanmap-buildout

2) make

---------------------

4)Activate the virtualenv (source {env _location}/bin/activate)

5)Go the the urbanmap folder (where the development.ini is)

6)paster setup-app development.ini

7)Edit development.ini to reflect mapfish print module installation (print.jar)

8)Edit development.ini to edit the path to print configuration (print.config={urbanmap_install_dir/print/config.yaml)

7)paster serve development.ini (and go to http://localhost:5000)


DataBase Configuration
======================

connection informations are in the development.ini

You need standard urbanmap tables + 2 views:
--------------------------------------------

CREATE OR REPLACE VIEW v_map_capa AS 
 SELECT map.capakey, map.capakey AS codeparcelle, map.urbainkey, map.daa, map.ord, map.pe, map.adr1, map.adr2, map.pe2, map.sl1, map.prc, map.na1, map.co1, map.cod1, map.ri1, map.acj, map.tv, map.prc2, capa.capaty, capa.shape_area, capa.the_geom, capa.da, capa.section, capa.radical, capa.exposant, capa.bis, capa.puissance
   FROM map
   LEFT JOIN capa ON map.capakey::text = capa.capakey::text;

CREATE OR REPLACE VIEW v_sections AS 
 SELECT DISTINCT capa.section, capa.section::text AS section_text
   FROM capa;

