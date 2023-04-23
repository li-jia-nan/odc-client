import { DbObjectType, IDatabase } from '@/d.ts';
import SessionStore from '@/store/sessionManager/session';
import SynonymSvg from '@/svgr/menuSynonym.svg';
import Icon, { FolderOpenFilled } from '@ant-design/icons';
import { ResourceNodeType, TreeDataNode } from '../type';

export function SynonymTreeData(
  dbSession: SessionStore,
  database: IDatabase,
  isPublic: boolean = false,
): TreeDataNode {
  const dbName = database.name;
  const synonyms = isPublic ? dbSession?.database?.publicSynonyms : dbSession?.database?.synonyms;
  const treeData: TreeDataNode = {
    title: isPublic ? '公共同义词' : '同义词',
    key: `${dbName}-synonym-${isPublic}`,
    type: isPublic ? ResourceNodeType.PublicSynonymRoot : ResourceNodeType.SynonymRoot,
    data: database,
    icon: (
      <FolderOpenFilled
        style={{
          color: '#3FA3FF',
        }}
      />
    ),
    sessionId: dbSession?.sessionId,
    isLeaf: false,
  };
  if (synonyms) {
    treeData.children = synonyms.map((synonym) => {
      const key = `${dbName}-sequence-${synonym.synonymName}`;
      return {
        title: synonym.synonymName,
        key,
        type: isPublic ? ResourceNodeType.PublicSynonym : ResourceNodeType.Synonym,
        data: synonym,
        dbObjectType: DbObjectType.synonym,
        icon: (
          <Icon
            component={SynonymSvg}
            style={{
              color: 'var(--icon-color-5)',
            }}
          />
        ),
        sessionId: dbSession?.sessionId,
        isLeaf: true,
      };
    });
  }

  return treeData;
}
